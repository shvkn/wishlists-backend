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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { OwnerGuard } from '../guards/owner.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Request() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  last() {
    return this.wishesService.getLast(20, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get('top')
  top() {
    return this.wishesService.getTop(40, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findOne(+id, {
      owner: true,
      offers: true,
    });
  }
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.wishesService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Param('id') id: string, @Request() req) {
    return this.wishesService.copy(+id, req.user);
  }
}
