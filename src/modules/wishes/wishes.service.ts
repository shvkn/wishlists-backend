import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createWishDto: CreateWishDto, owner: User) {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner,
      raised: 0,
    });
  }
  async findOne(id: number) {
    try {
      const wish = await this.wishesRepository.findOneOrFail({
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

      return wish;
    } catch (e) {
      throw new NotFoundException(`Подарок с id: ${id} не найден`);
    }
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (updateWishDto.price >= 0 && wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя изменять стоимость, если уже есть желающие скинуться',
      );
    }
    return await this.wishesRepository.save({
      id: wish.id,
      ...updateWishDto,
    });
  }

  async delete(id: number) {
    const wish = await this.findOne(id);
    return this.wishesRepository.delete({ id: wish.id });
  }

  async copy(id: number, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...wish } = await this.findOne(id);
      await queryRunner.manager.save(Wish, {
        id,
        ...wish,
        copied: wish.copied + 1,
      });
      const copiedWish = await queryRunner.manager.save(Wish, {
        ...wish,
        owner: user,
        raised: 0,
        copied: 0,
      });
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getLast(count, relations?: FindOptionsRelations<Wish>) {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
      relations,
    });
  }

  async getTop(count, relations?: FindOptionsRelations<Wish>) {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: count,
      relations,
    });
  }
}
