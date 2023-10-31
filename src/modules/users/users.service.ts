import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { UserAlreadyExistsException } from '../../error-exceptions/user-already-exists.exception';
import { UserNotFoundException } from '../../error-exceptions/user-not-found.exception';
import { hash } from '../../utils/hash-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }
    return this.usersRepository.save({
      ...createUserDto,
      password: hash(createUserDto.password),
    });
  }

  async update(
    options: FindOneOptions<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.findOne(options);
      if (updateUserDto.password?.length > 0) {
        updateUserDto.password = hash(updateUserDto.password);
      }
      await this.usersRepository.update(user.id, updateUserDto);
      return await this.findOne(options);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (e) {
      throw new UserNotFoundException();
    }
  }

  async findMany(options?: FindManyOptions<User>): Promise<User[]> {
    return await this.usersRepository.find(options);
  }
}
