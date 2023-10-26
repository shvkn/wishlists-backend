import { forwardRef, Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { WishlistsModule } from '../wishlists/wishlists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    forwardRef(() => WishlistsModule),
  ],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
