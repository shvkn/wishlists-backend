import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { ExceptionsMessages } from '../../utils/exception-messages.constants';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignInUserResponseDto } from './dto/sign-in-user-response.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpUserResponseDto } from './dto/sign-up-user-response.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ description: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({ type: SignUpUserResponseDto })
  @ApiConflictResponse({ description: ExceptionsMessages.USER_ALREADY_EXISTS })
  async signup(
    @Body() signUpDto: SignUpUserDto,
  ): Promise<SignUpUserResponseDto> {
    return await this.authService.register(signUpDto);
  }

  @Post('signin')
  @ApiOperation({ description: 'Авторизация пользователя' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInUserDto })
  @ApiCreatedResponse({ type: SignInUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Некорректная пара логин и пароль' })
  signin(@AuthorizedUser() user): SignInUserResponseDto {
    return this.authService.provideJwtTokens(user);
  }
}
