import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Like } from 'typeorm';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ExceptionsMessages } from '../../utils/exception-messages.constants';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicResponseDto } from './dto/user-public-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    description: 'Запрос на получение профайла авторизованного пользователя',
  })
  @ApiOkResponse({ type: UserProfileResponseDto })
  async findOwn(@AuthorizedUser('id') userId): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne({ where: { id: userId } });
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      about: user.about,
    };
  }

  @Patch('me')
  @ApiOperation({
    description: 'Запрос на обновление профайла авторизованного пользователя',
  })
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiBadRequestResponse({ description: ExceptionsMessages.VALIDATION_ERR })
  async update(
    @AuthorizedUser('id') id,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.update(
      { where: { id } },
      updateUserDto,
    );
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      about: user.about,
    };
  }

  @Get('me/wishes')
  @ApiOperation({
    description: 'Получение списка подарков авторизованного пользователя',
  })
  @ApiOkResponse({ type: Wish, isArray: true })
  async getOwnWishes(@AuthorizedUser() user1): Promise<Wish[]> {
    const user = await this.usersService.findOne({
      where: { id: user1.id },
      select: { wishes: true },
      relations: { wishes: { owner: true, offers: { user: true } } },
    });
    return user.wishes;
  }

  @Get(':username')
  @ApiOperation({ description: 'Получение профайла пользователя по USERNAME' })
  @ApiOkResponse({ type: UserPublicResponseDto, isArray: true })
  async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicResponseDto> {
    const user = await this.usersService.findOne({ where: { username } });
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      avatar: user.avatar,
      about: user.about,
    };
  }

  @Get(':username/wishes')
  @ApiOperation({
    description: 'Получение списка подарков пользователя по USERNAME',
  })
  @ApiOkResponse({ type: UserWishesDto, isArray: true })
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne({
      where: { username },
      relations: { wishes: { offers: { user: true } } },
    });
    return user.wishes;
  }

  @Post('find')
  @ApiOperation({ description: 'Получение списка пользователя по QUERY' })
  @ApiOkResponse({ type: UserProfileResponseDto, isArray: true })
  async findMany(
    @Body() findUserDto: FindUserDto,
  ): Promise<UserProfileResponseDto[]> {
    const template = `%${findUserDto.query}%`;
    return await this.usersService.findMany({
      where: [{ email: Like(template) }, { username: Like(template) }],
    });
  }
}
