import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Like, Repository } from 'typeorm';

import { UserExistsException } from '../../error-exeptions/user-exists.exception';
import { UserNotFoundedException } from '../../error-exeptions/user-not-founded.exception';
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
    query: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    try {
      const user = await this.findOne(query);
      if (updateUserDto.password?.length > 0) {
        updateUserDto.password = hash(updateUserDto.password);
      }
      await this.usersRepository.update({ id: user.id }, updateUserDto);
      const updated = await this.findOne(query);
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
      throw new BadRequestException(e.detail);
    }
  }

  async findOne(query: string, options?: FindOneOptions<User>): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        ...options,
        where: [{ username: query }, { email: query }],
      });
    } catch (e) {
      throw new UserNotFoundedException();
    }
  }

  async findMany(query: string): Promise<UserProfileResponseDto[]> {
    const template = `%${query}%`;
    return await this.usersRepository.findBy([
      { email: Like(template) },
      { username: Like(template) },
    ]);
  }
}
