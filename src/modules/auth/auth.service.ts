import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignInUserResponseDto } from './dto/sign-in-user-response.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpUserResponseDto } from './dto/sign-up-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  register(signUpDto: SignUpUserDto): Promise<SignUpUserResponseDto> {
    return this.usersService.createOne(signUpDto);
  }

  provideJwtTokens(user: User): SignInUserResponseDto {
    const payload: IJwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }

  async validateUser(signInDto: SignInUserDto) {
    const user = await this.usersService.findOneByQuery(signInDto.username);
    if (user && (await user?.validatePassword(signInDto.password))) {
      return user;
    }
    return null;
  }

  async validateUserByUsername(username: string) {
    return (await this.usersService.findOneByQuery(username)) || null;
  }
}
