import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

import { ApiDefaults, ApiPropertiesExamples } from '../../../utils/constants';

export class CreateUserDto {
  @ApiProperty({ example: ApiPropertiesExamples.User.USERNAME })
  @IsString()
  username: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.EMAIL })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: ApiPropertiesExamples.User.PASSWORD,
  })
  @IsString()
  password: string;

  @IsOptional()
  @Length(1, 200)
  @ApiProperty({
    required: false,
    example: ApiPropertiesExamples.User.ABOUT,
    default: ApiDefaults.User.ABOUT,
  })
  @IsString()
  about?: string;

  @ApiProperty({
    required: false,
    example: ApiPropertiesExamples.User.AVATAR,
    default: ApiDefaults.User.AVATAR,
  })
  @IsUrl()
  @IsOptional()
  @IsEmpty()
  avatar?: string;
}
