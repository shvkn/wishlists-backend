import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/sign-in-user-response.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpUserResponseDto } from './dto/sign-up-user-response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpUserDto): Promise<SignUpUserResponseDto> {
    return this.authService.register(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req): SignInUserResponseDto {
    return this.authService.provideJwtTokens(req.user);
  }
}
