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
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
@ApiTags('Wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiOperation({ description: 'Получение всех вишлистов' })
  @ApiOkResponse({ type: Wishlist, isArray: true })
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Post()
  @ApiOperation({ description: 'Создание вишлиста' })
  @ApiCreatedResponse({ type: Wishlist })
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthorizedUser('userId') userId,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, userId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Получение вишлиста по ID' })
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISHLIST_NOT_FOUND })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Patch(':id')
  @ApiOperation({ description: 'Обновление вишлиста по ID' })
  @UseGuards(OwnerGuard)
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISHLIST_NOT_FOUND })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update({ where: { id } }, updateWishlistDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Удаление вишлиста по ID' })
  @UseGuards(OwnerGuard)
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: ExceptionsMessages.WISHLIST_NOT_FOUND })
  removeOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.removeOne({ where: { id } });
  }
}
