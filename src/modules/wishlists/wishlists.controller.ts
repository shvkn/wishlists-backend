import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id, { items: true, owner: true });
  }

  @Get()
  getAll() {
    return this.wishlistsService.getAll({ owner: true, items: true });
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(+id, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  deleteById(@Param('id') id: string) {
    return this.wishlistsService.deleteOne(+id);
  }
}
