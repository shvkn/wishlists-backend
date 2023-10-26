import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId, {
      owner: true,
    });
    if (wish.owner.id === user.id) {
      throw new ConflictException('Нельзя скидываться себе на подарок');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      wish.raiseAmount(createOfferDto.amount);
      await queryRunner.manager.save(wish);
      const offer = await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        item: { id: wish.id },
        user,
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

  async getById(id: number, relations?: FindOptionsRelations<Offer>) {
    try {
      return await this.offersRepository.findOneOrFail({
        where: { id },
        relations,
      });
    } catch (e) {
      throw new NotFoundException(`Offer with id: ${id} not founded`);
    }
  }

  async getAll(relations?: FindOptionsRelations<Offer>) {
    return await this.offersRepository.find({
      relations,
    });
  }
}
