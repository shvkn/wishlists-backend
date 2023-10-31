import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { UserExistsException } from '../../error-exceptions/user-exists.exception';
import { UserNotFoundedException } from '../../error-exceptions/user-not-founded.exception';
import { hash } from '../../utils/hash-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new UserExistsException();
    }
    return this.usersRepository.save({
      ...createUserDto,
      password: hash(createUserDto.password),
    });
  }

  async update(
    options: FindOneOptions<User>,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    try {
      const user = await this.findOne(options);
      if (updateUserDto.password?.length > 0) {
        updateUserDto.password = hash(updateUserDto.password);
      }
      await this.usersRepository.update(user.id, updateUserDto);
      const updated = await this.findOne({
        where: { id: user.id },
      });
      return {
        id: updated.id,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        username: updated.username,
        email: updated.email,
        avatar: updated.avatar,
        about: updated.about,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail(options);
    } catch (e) {
      throw new UserNotFoundedException();
    }
  }

  async findMany(
    options?: FindManyOptions<User>,
  ): Promise<UserProfileResponseDto[]> {
    return await this.usersRepository.find(options);
  }
}
