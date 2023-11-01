import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class CreateUserResponseDto {
  @ApiProperty({ example: SwaggerExamples.Common.ID })
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  updatedAt: Date;

  @ApiProperty({ example: SwaggerExamples.User.USERNAME })
  @IsString()
  username: string;

  @ApiProperty({ example: SwaggerExamples.User.EMAIL })
  @IsEmail()
  email: string;

  @ApiProperty({ example: SwaggerExamples.User.PASSWORD })
  @IsString()
  password: string;

  @ApiProperty({ required: false, example: SwaggerExamples.User.ABOUT })
  @Length(1, 200)
  @IsString()
  about: string;

  @ApiProperty({ required: false, example: SwaggerExamples.User.AVATAR })
  @IsUrl()
  avatar: string;
}
