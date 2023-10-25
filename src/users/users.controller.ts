import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req, updateUserDto: UpdateUserDto) {
    const username = req.user.username;
    return this.usersService.update(username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  getWishes(@Request() req) {
    const username = req.user.username;
    return this.usersService.findWishes(username);
  }

  @Get('find')
  findUserByQuery(@Body() body: { query: string }) {
    return this.usersService.findOne(body.query);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }
}
