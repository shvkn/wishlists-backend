import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { SwaggerTags } from '../../utils/swagger.constants';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

const WISH_NOT_FOUNDED = 'Подарок с id = #{ID} не найден';

const PRICE_CHANGING_IS_NOT_ALLOWED =
  'Нельзя изменять стоимость, если уже есть желающие скинуться';

@Controller('wishes')
@ApiTags(SwaggerTags.WISHES)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Wish })
  create(
    @Body() createWishDto: CreateWishDto,
    @AuthorizedUser() user,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  @ApiOkResponse({ type: Wish, isArray: true })
  findLast(): Promise<Wish[]> {
    const LIMIT = 20;
    return this.wishesService.findMany({
      order: { createdAt: 'DESC' },
      take: LIMIT,
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  @Get('top')
  @ApiOkResponse({ type: Wish, isArray: true })
  findTop(): Promise<Wish[]> {
    const LIMIT = 40;
    return this.wishesService.findMany({
      order: { copied: 'DESC' },
      take: LIMIT,
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish, isArray: true })
  @ApiNotFoundResponse({ description: WISH_NOT_FOUNDED })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    return this.wishesService.findOne({ where: { id } });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish })
  @ApiBadRequestResponse({ description: PRICE_CHANGING_IS_NOT_ALLOWED })
  @ApiNotFoundResponse({ description: WISH_NOT_FOUNDED })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update({ where: { id } }, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish })
  @ApiNotFoundResponse({ description: WISH_NOT_FOUNDED })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    return this.wishesService.delete({ where: { id } });
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Wish })
  @ApiNotFoundResponse({ description: WISH_NOT_FOUNDED })
  copyWish(
    @Param('id', ParseIntPipe) id: number,
    @AuthorizedUser('userId') userId,
  ): Promise<Wish> {
    return this.wishesService.copy({ where: { id } }, userId);
  }
}
