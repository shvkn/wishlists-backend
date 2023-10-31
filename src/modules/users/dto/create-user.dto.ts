import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class CreateUserDto {
  @ApiProperty({ example: SwaggerExamples.User.USERNAME })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({ example: SwaggerExamples.User.EMAIL })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: SwaggerExamples.User.PASSWORD,
  })
  @IsString()
  password: string;

  @IsOptional()
  @Length(1, 200)
  @ApiProperty({
    required: false,
    example: SwaggerExamples.User.ABOUT,
  })
  @IsString()
  about?: string;

  @ApiProperty({
    required: false,
    example: SwaggerExamples.User.AVATAR,
  })
  @IsUrl()
  @IsOptional()
  @IsEmpty()
  avatar?: string;
}
