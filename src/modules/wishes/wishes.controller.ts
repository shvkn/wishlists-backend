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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { ExceptionsMessages } from '../../utils/exception-messages.constants';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
@ApiTags('Wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @ApiOperation({ description: 'Создание подарка' })
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
  @ApiOperation({
    description:
      'Получение 20 подарков, которые копируют в свой профиль чаще всего',
  })
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
  @ApiOperation({
    description: 'Получение 40 подарков добавленных недавно',
  })
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
  @ApiOperation({ description: 'Получение подарка по ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish, isArray: true })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISH_NOT_FOUND })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    return this.wishesService.findOne({ where: { id } });
  }

  @Patch(':id')
  @ApiOperation({ description: 'Обновление подарка по ID' })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish })
  @ApiBadRequestResponse({
    description: ExceptionsMessages.PRICE_CHANGING_NOT_ALLOWED,
  })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISH_NOT_FOUND })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update({ where: { id } }, updateWishDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Удаление подарка по ID' })
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Wish })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISH_NOT_FOUND })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    return this.wishesService.delete({ where: { id } });
  }

  @Post(':id/copy')
  @ApiOperation({ description: 'Копирование подарка по ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Wish })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISH_NOT_FOUND })
  copyWish(
    @Param('id', ParseIntPipe) id: number,
    @AuthorizedUser('userId') userId,
  ): Promise<Wish> {
    return this.wishesService.copy({ where: { id } }, userId);
  }
}
