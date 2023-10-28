import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

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

  // @ValidateIf((object) => object.value === '')
  @IsOptional()
  @Length(1, 200)
  @ApiProperty({
    required: false,
    example: 'Пока ничего не рассказал о себе',
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  about?: string = 'Пока ничего не рассказал о себе';

  @ApiProperty({
    required: false,
    example: 'https://i.pravatar.cc/3001',
    default: 'https://i.pravatar.cc/3001',
  })
  @IsUrl()
  @IsOptional()
  @IsEmpty()
  avatar?: string;
}
