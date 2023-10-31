import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthorizedUser } from '../../decorators/authorized-user';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SwaggerTags } from '../../utils/swagger.constants';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignInUserResponseDto } from './dto/sign-in-user-response.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignUpUserResponseDto } from './dto/sign-up-user-response.dto';

@ApiTags(SwaggerTags.AUTH)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    type: SignUpUserResponseDto,
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким email или username уже зарегистрирован',
  })
  async signup(
    @Body() signUpDto: SignUpUserDto,
  ): Promise<SignUpUserResponseDto> {
    return await this.authService.register(signUpDto);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: SignInUserDto,
  })
  @ApiCreatedResponse({
    type: SignInUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Некорректная пара логин и пароль',
  })
  signin(@AuthorizedUser() user): SignInUserResponseDto {
    return this.authService.provideJwtTokens(user);
  }
}
