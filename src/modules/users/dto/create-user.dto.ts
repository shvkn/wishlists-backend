import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'somestrongpassword',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    example: 'Пока ничего не рассказал о себе',
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(1, 200)
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    required: false,
    example: 'https://i.pravatar.cc/300',
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
