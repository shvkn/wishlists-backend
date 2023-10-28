import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

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
      raised: 0,
    });
  }

  async findOne(id: number): Promise<Wish> {
    try {
      return await this.wishesRepository.findOneOrFail({
        select: {
          owner: {
            id: true,
            username: true,
            about: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
          offers: true,
        },
        where: { id },
        relations: {
          owner: true,
          offers: {
            user: true,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(`Подарок с id: ${id} не найден`);
    }
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.findOne(id);
    if (updateWishDto.price >= 0 && wish.raised > 0) {
      throw new ConflictException(
        'Нельзя изменять стоимость, если уже есть желающие скинуться',
      );
    }
    return await this.wishesRepository.save({
      id: wish.id,
      ...updateWishDto,
    });
  }

  async delete(id: number): Promise<Wish> {
    try {
      const wish = await this.findOne(id);
      await this.wishesRepository.delete({ id: wish.id });
      return wish;
    } catch (e) {
      throw new Error(e);
    }
  }

  async copy(id: number, user: IUser): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.findOne(id);
      await queryRunner.manager.save(Wish, {
        ...wish,
        copied: wish.copied + 1,
      });
      const copiedWish = await queryRunner.manager.create(Wish, {
        ...wish,
        owner: { id: user.id },
      });
      await queryRunner.manager.save(Wish, copiedWish);
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findLast(
    count,
    relations?: FindOptionsRelations<Wish>,
  ): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
      relations,
    });
  }

  async findTop(
    count,
    relations?: FindOptionsRelations<Wish>,
  ): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: count,
      relations,
    });
  }
}
