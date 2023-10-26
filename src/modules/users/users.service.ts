import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

import { HashUtilityService } from '../../hash-utility/hash-utility.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким email или username уже зарегистрирован`,
      );
    }
    const hashedPassword = await HashUtilityService.hash(
      createUserDto.password,
    );
    return this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async updateOne(query: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneByQuery(query);
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async findOneByQuery(
    query: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: [{ username: query }, { email: query }],
        relations,
      });
    } catch (e) {
      throw new NotFoundException(
        `Пользователь с таким email или username не найден`,
      );
    }
  }

  async findManyByQuery(
    query: string,
    relations?: FindOptionsRelations<User>,
  ): Promise<User[]> {
    const template = `%${query}%`;
    return await this.usersRepository.find({
      where: [{ email: Like(template) }, { username: Like(template) }],
      relations,
    });
  }
}
