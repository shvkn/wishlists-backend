import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashUtilityService } from '../hash-utility/hash-utility.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      // TODO CustomException
      throw new BadRequestException();
    }
    const hash = await HashUtilityService.hash(createUserDto.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.usersRepository.save({
      ...createUserDto,
      password: hash,
    });
    return user;
  }

  async findOne(query: string): Promise<User> | null {
    return await this.usersRepository.findOne({
      where: [{ email: query }, { username: query }],
    });
  }

  async findWishes(query: string) {
    return this.usersRepository.findOne({
      where: [{ email: query }, { username: query }],
      relations: {
        /*wishes: true,*/
      },
    });
  }

  async update(query: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(query);
    if (!user) {
      throw new BadRequestException();
    }
    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }
}
