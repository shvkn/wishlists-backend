import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

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

  @ApiProperty({ required: false, example: SwaggerExamples.User.ABOUT })
  @IsOptional()
  @Length(1, 200)
  @IsString()
  about?: string;

  @ApiProperty({ required: false, example: SwaggerExamples.User.AVATAR })
  @IsUrl()
  @IsOptional()
  avatar?: string;
}
