import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  about?: string;

  @IsString()
  avatar?: string;
}
