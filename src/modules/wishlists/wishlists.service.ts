import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { WishlistNotFoundedException } from '../../error-exceptions/wishlist-not-founded.exception';
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
    const { itemsId, ...data } = createWishlistDto;
    const items: Wish[] = await Promise.all(
      itemsId.map((id) => this.wishesService.findOne({ where: { id } })),
    );
    return await this.wishlistsRepository.save({
      ...data,
      items,
      owner: user,
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
      itemsId.map((id) => this.wishesService.findOne({ where: { id } })),
    );
    return await this.wishlistsRepository.save({
      id,
      ...data,
      items,
    });
  }

  async removeOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.findOne(options);
    await this.wishlistsRepository.delete(wishlist.id);
    return wishlist;
  }
}
