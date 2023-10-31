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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { SwaggerTags } from '../../utils/constants';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
@ApiTags(SwaggerTags.WISHLISTS)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiOkResponse({
    type: Wishlist,
    isArray: true,
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
  @ApiCreatedResponse({
    type: Wishlist,
  })
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Wishlist,
  })
  @ApiNotFoundResponse({
    description: 'Вишлист с id: #{id} не найден',
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
  @UseGuards(OwnerGuard)
  @ApiOkResponse({
    type: Wishlist,
  })
  @ApiNotFoundResponse({
    description: 'Вишлист с id: #{id} не найден',
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
  @UseGuards(OwnerGuard)
  @ApiOkResponse({
    type: Wishlist,
  })
  @ApiNotFoundResponse({
    description: 'Вишлист с id: #{id} не найден',
  })
  removeOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.removeOne(id);
  }
}
