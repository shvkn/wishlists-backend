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
import { Like } from 'typeorm';

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

const VALIDATION_ERROR = 'Ошибка валидации переданных значений';

@Controller('users')
@ApiTags(SwaggerTags.USERS)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({ type: UserProfileResponseDto })
  async findOwn(@AuthorizedUser('userId') id): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne({ where: { id } });
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
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiBadRequestResponse({ description: VALIDATION_ERROR })
  async update(
    @AuthorizedUser('userId') id,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const updated = await this.usersService.update(
      { where: { id } },
      updateUserDto,
    );
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

  @Get('me/wishes')
  @ApiOkResponse({ type: Wish, isArray: true })
  async getOwnWishes(@AuthorizedUser('userId') id): Promise<Wish[]> {
    const { wishes } = await this.usersService.findOne({
      where: { id },
      select: { wishes: true },
      relations: { wishes: { offers: true } },
    });
    return wishes;
  }

  @Get(':username')
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
  @ApiOkResponse({ type: UserWishesDto, isArray: true })
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne({
      where: { username },
      select: { wishes: true },
      relations: { wishes: { offers: true } },
    });
    return user.wishes;
  }

  @Post('find')
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
