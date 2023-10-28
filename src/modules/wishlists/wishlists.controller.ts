import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@ApiTags('wishlists')
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiResponse({
    type: Wishlist,
    isArray: true,
    status: 200,
  })
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wishlist,
    status: 201,
  })
  create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @ApiResponse({
    type: Wishlist,
    status: 200,
  })
  @ApiResponse({
    description: 'Вишлист с id: #{id} не найден',
    status: 404,
  })
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.findOne(id, {
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wishlist,
    status: 200,
  })
  @ApiResponse({
    description: 'Вишлист с id: #{id} не найден',
    status: 404,
  })
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wishlist,
    status: 200,
  })
  @ApiResponse({
    description: 'Вишлист с id: #{id} не найден',
    status: 404,
  })
  removeOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.wishlistsService.removeOne(id);
  }
}
