import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
