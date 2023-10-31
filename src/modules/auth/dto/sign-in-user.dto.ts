import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class SignInUserDto {
  @ApiProperty({ example: SwaggerExamples.User.USERNAME })
  @IsString()
  username: string;

  @ApiProperty({ example: SwaggerExamples.User.PASSWORD })
  @IsString()
  password: string;
}
