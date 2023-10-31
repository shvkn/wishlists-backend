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

@Controller('wishes')
@ApiTags(SwaggerTags.WISHES)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: Wish,
  })
  create(
    @Body() createWishDto: CreateWishDto,
    @AuthorizedUser() user,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  @ApiOkResponse({
    type: Wish,
    isArray: true,
  })
  findLast(): Promise<Wish[]> {
    const LIMIT = 20;
    return this.wishesService.findLast(LIMIT, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get('top')
  @ApiOkResponse({
    type: Wish,
    isArray: true,
  })
  findTop(): Promise<Wish[]> {
    const LIMIT = 40;
    return this.wishesService.findTop(LIMIT, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Wish,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Подарок с id: #{id} не найден',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Wish,
  })
  @ApiBadRequestResponse({
    description: 'Нельзя изменять стоимость, если уже есть желающие скинуться',
  })
  @ApiNotFoundResponse({
    description: 'Подарок с id: #{id} не найден',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Wish,
  })
  @ApiNotFoundResponse({
    description: 'Подарок с id: #{id} не найден',
  })
  delete(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Wish> {
    return this.wishesService.delete(id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: Wish,
  })
  @ApiNotFoundResponse({
    description: 'Подарок с id: #{id} не найден',
  })
  copyWish(
    @Param('id', ParseIntPipe)
    id: number,
    @AuthorizedUser() user,
  ): Promise<Wish> {
    return this.wishesService.copy(id, user);
  }
}
