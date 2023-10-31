import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from '../../utils/hash-utils';
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
    return this.usersService.create(signUpDto);
  }

  provideJwtTokens(user: User): SignInUserResponseDto {
    const payload: IJwtPayload = { userId: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }

  async validateUser(signInDto: SignInUserDto) {
    const user = await this.usersService.findOne(signInDto.username);
    if (user && (await compare(signInDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async validateUserById(id: number) {
    return (await this.usersService.findOneById(id)) || null;
  }
}
