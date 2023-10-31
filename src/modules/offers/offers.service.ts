import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { CantOfferSelfWishException } from '../../error-exceptions/cant-offer-self-wish.exception';
import { IncorrectOfferAmountException } from '../../error-exceptions/incorrect-offer-amount.exception';
import { OfferNotFoundException } from '../../error-exceptions/offer-not-found.exception';
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
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
    });
    if (wish.owner.id === user.id) {
      throw new CantOfferSelfWishException();
    }
    const neededSum = wish.price - wish.raised;
    if (createOfferDto.amount > neededSum) {
      throw new IncorrectOfferAmountException(
        `Сумма взноса не должна превышать ${neededSum}`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const offer = await queryRunner.manager.create(Offer, {
        ...createOfferDto,
        item: { id: wish.id },
        user: { id: user.id },
      });
      await queryRunner.manager.save<Offer>(offer);
      await queryRunner.manager.update(Wish, wish.id, {
        raised:
          Math.round((wish.raised + offer.amount + Number.EPSILON) * 100) / 100,
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

  async findOne(options: FindOneOptions<Offer>) {
    try {
      return await this.offersRepository.findOneOrFail(options);
    } catch (e) {
      throw new OfferNotFoundException();
    }
  }
}
