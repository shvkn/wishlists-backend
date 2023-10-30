import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SwaggerTags } from '../../utils/constants';
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
  @ApiResponse({
    type: UserProfileResponseDto,
    status: 200,
  })
  async findOwn(@Request() req: IUserRequest): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne(req.user.username);

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
  @ApiResponse({
    type: UserProfileResponseDto,
    status: 200,
  })
  @ApiResponse({
    description: 'Ошибка валидации переданных значений',
    status: 400,
  })
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.update(
      req.user.username,
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
  @ApiResponse({
    type: Wish,
    isArray: true,
    status: 200,
  })
  async getOwnWishes(@Request() req: IUserRequest): Promise<Wish[]> {
    const user = await this.usersService.findOne(req.user.username, {
      select: { wishes: true },
      relations: { wishes: { offers: true } },
    });
    return user.wishes;
  }

  @Get(':username')
  @ApiResponse({
    type: UserPublicResponseDto,
    isArray: true,
    status: 200,
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
  @ApiResponse({
    type: UserWishesDto,
    isArray: true,
    status: 200,
  })
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne(username, {
      select: { wishes: true },
    });
    return user.wishes;
  }

  @Post('find')
  @ApiResponse({
    type: UserProfileResponseDto,
    isArray: true,
    status: 200,
  })
  async findMany(
    @Body() findUserDto: FindUserDto,
  ): Promise<UserProfileResponseDto[]> {
    return await this.usersService.findMany(findUserDto.query, {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        email: true,
        avatar: true,
        about: true,
      },
    });
  }
}
