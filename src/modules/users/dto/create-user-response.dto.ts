import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'user', description: 'username пользователя' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@yandex.ru', description: 'email пользователя' })
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
  })
  @Length(1, 200)
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    required: false,
    example: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
