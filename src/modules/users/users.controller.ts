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
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SwaggerTags } from '../../utils/swagger.constants';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicResponseDto } from './dto/user-public-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags(SwaggerTags.USERS)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    type: UserProfileResponseDto,
  })
  async findOwn(
    @AuthorizedUser('username') username,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne(username);

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
  @ApiOkResponse({
    type: UserProfileResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации переданных значений',
  })
  async update(
    @AuthorizedUser('username') username,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.update(username, updateUserDto);

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
  @ApiOkResponse({
    type: Wish,
    isArray: true,
  })
  async getOwnWishes(@AuthorizedUser('username') username): Promise<Wish[]> {
    const user = await this.usersService.findOne(username, {
      select: { wishes: true },
      relations: { wishes: { offers: true } },
    });
    return user.wishes;
  }

  @Get(':username')
  @ApiOkResponse({
    type: UserPublicResponseDto,
    isArray: true,
  })
  async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicResponseDto> {
    const user = await this.usersService.findOne(username);
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
  @ApiOkResponse({
    type: UserWishesDto,
    isArray: true,
  })
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne(username, {
      select: { wishes: true },
      relations: { wishes: { offers: true } },
    });
    return user.wishes;
  }

  @Post('find')
  @ApiOkResponse({
    type: UserProfileResponseDto,
    isArray: true,
  })
  async findMany(
    @Body() findUserDto: FindUserDto,
  ): Promise<UserProfileResponseDto[]> {
    return await this.usersService.findMany(findUserDto.query);
  }
}
