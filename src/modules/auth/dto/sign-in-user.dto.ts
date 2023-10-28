import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class SignInUserDto {
  @ApiProperty({ example: ApiPropertiesExamples.User.USERNAME })
  @IsString()
  username: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.PASSWORD })
  @IsString()
  password: string;
}
