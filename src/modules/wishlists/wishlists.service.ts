import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { WishlistNotFoundedException } from '../../error-exeptions/wishlist-not-founded.exception';
import { User } from '../users/entities/user.entity';
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
    user: User,
  ): Promise<Wishlist> {
    const { itemsId, ...restCreateWishlistDto } = createWishlistDto;
    try {
      const items: Wish[] = await Promise.all(
        itemsId.map((itemId) => this.wishesService.findOne(itemId)),
      );
      return await this.wishlistsRepository.save({
        ...restCreateWishlistDto,
        items,
        owner: user,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: number,
    options?: FindOneOptions<Wishlist>,
  ): Promise<Wishlist> {
    try {
      return await this.wishlistsRepository.findOneOrFail({
        ...options,
        where: { id },
      });
    } catch (error) {
      throw new WishlistNotFoundedException(id);
    }
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { itemsId, ...restUpdateWishlistDto } = updateWishlistDto;
    const wishlist = await this.findOne(id);
    const items: Wish[] = await Promise.all(
      itemsId.map((itemId) => this.wishesService.findOne(itemId)),
    );
    return await this.wishlistsRepository.save({
      ...wishlist,
      ...restUpdateWishlistDto,
      items,
    });
  }

  async removeOne(id: number) {
    const wishlist = await this.findOne(id);
    return await this.wishlistsRepository.delete({ id: wishlist.id });
  }
}
