import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Like, Repository } from 'typeorm';

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
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException(
        `Пользователь с таким email или username уже зарегистрирован`,
      );
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
    const user = await this.findOne(query);
    const updated = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
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
  }

  async findOne(query: string, options?: FindOneOptions<User>): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        ...options,
        where: [{ username: query }, { email: query }],
      });
    } catch (e) {
      throw new NotFoundException(
        `Пользователь с таким email или username не найден`,
      );
    }
  }

  async findMany(
    query: string,
    options?: FindOneOptions<User>,
  ): Promise<UserProfileResponseDto[]> {
    const template = `%${query}%`;
    return await this.usersRepository.find({
      ...options,
      where: [{ email: Like(template) }, { username: Like(template) }],
    });
  }
}
