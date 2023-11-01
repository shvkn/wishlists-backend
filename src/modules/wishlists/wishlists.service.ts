import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { WishlistNotFoundedException } from '../../error-exceptions/wishlist-not-founded.exception';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
  ) {}

  async findAll(options?: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find(options);
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...data } = createWishlistDto;
    const items: Wish[] = await Promise.all(
      itemsId.map((id) => {
        return this.wishesService.findOne({
          where: { id },
          select: { id: true },
        });
      }),
    );
    return await this.wishlistsRepository.save({
      ...data,
      items,
      owner: { id: userId },
    });
  }

  async findOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    try {
      return await this.wishlistsRepository.findOneOrFail(options);
    } catch (error) {
      throw new WishlistNotFoundedException();
    }
  }

  async update(
    options: FindOneOptions<Wishlist>,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { itemsId, ...data } = updateWishlistDto;
    const { id } = await this.findOne(options);
    const items: Wish[] = await Promise.all(
      itemsId.map((id) => {
        return this.wishesService.findOne({
          where: { id },
          select: { id: true },
        });
      }),
    );
    const updated = await this.wishlistsRepository.preload({
      id,
      ...data,
      items,
    });
    return await this.wishlistsRepository.save(updated);
  }

  async removeOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.findOne(options);
    await this.wishlistsRepository.delete(wishlist.id);
    return wishlist;
  }
}
