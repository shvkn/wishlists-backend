import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';

import { OfferOnSelfWishException } from '../../error-exeptions/offer-on-self-wish.exception';
import { WishNotFoundedException } from '../../error-exeptions/wish-not-founded.exception';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: IUser) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    if (wish.owner.id === user.id) {
      throw new OfferOnSelfWishException();
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      wish.raiseAmount(createOfferDto.amount);
      await queryRunner.manager.save(Wish, wish);
      const offer = await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        item: { id: wish.id },
        user: { id: user.id },
      });
      await queryRunner.commitTransaction();
      return offer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(options?: FindManyOptions<Offer>): Promise<Offer[]> {
    return await this.offersRepository.find(options);
  }

  async findOne(id: number, options?: FindManyOptions<Offer>) {
    try {
      return await this.offersRepository.findOneOrFail({
        ...options,
        where: { id },
      });
    } catch (e) {
      throw new WishNotFoundedException(id);
    }
  }
}
