import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getProfile() {
    // TODO Auth
    return this.usersService.findOne('MY_USERNAME');
  }

  @Patch('me')
  updateProfile(updateUserDto: UpdateUserDto) {
    // TODO Auth
    return this.usersService.update('MY_USERNAME', updateUserDto);
  }

  @Get('me/wishes')
  getWishes() {
    // TODO Auth
    return this.usersService.findWishes('MY_USERNAME');
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
