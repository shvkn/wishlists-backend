import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { WishNotFoundException } from '../../error-exceptions/wish-not-found.exception';
import { WishPriceCantBeUpdatedException } from '../../error-exceptions/wish-price-cant-be-updated.exception';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, owner: IUser): Promise<Wish> {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: { id: owner.id },
    });
  }

  async findOne(options: FindOneOptions<Wish>): Promise<Wish> {
    try {
      return await this.wishesRepository.findOneOrFail(options);
    } catch (e) {
      throw new WishNotFoundException();
    }
  }

  async update(
    options: FindOneOptions<Wish>,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(options);
    if (updateWishDto.price >= 0 && wish.raised > 0) {
      throw new WishPriceCantBeUpdatedException();
    }
    await this.wishesRepository.update(wish.id, updateWishDto);
    return await this.findOne(options);
  }

  async delete(options: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.findOne(options);
    await this.wishesRepository.delete(wish.id);
    return wish;
  }

  async copy(options: FindOneOptions<Wish>, userId: number): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        id: wishId,
        name,
        link,
        image,
        price,
        description,
      } = await this.findOne(options);
      await queryRunner.manager.increment(Wish, wishId, 'copied', 1);
      const copiedWish = queryRunner.manager.create(Wish, {
        name,
        link,
        image,
        price,
        description,
        owner: { id: userId },
      });
      await queryRunner.manager.insert(Wish, copiedWish);
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findMany(options?: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(options);
  }
}
