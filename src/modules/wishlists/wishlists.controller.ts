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
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { SwaggerTags } from '../../utils/swagger.constants';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

const WISHLIST_NOT_FOUNDED = 'Вишлист с id = #{ID} не найден';

@Controller('wishlistlists')
@ApiTags(SwaggerTags.WISHLISTS)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
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
  @ApiCreatedResponse({ type: Wishlist })
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthorizedUser() user,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get(':id')
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: WISHLIST_NOT_FOUNDED })
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
  @UseGuards(OwnerGuard)
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: WISHLIST_NOT_FOUNDED })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update({ where: { id } }, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @ApiOkResponse({ type: Wishlist })
  @ApiNotFoundResponse({ description: WISHLIST_NOT_FOUNDED })
  removeOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.removeOne({ where: { id } });
  }
}
