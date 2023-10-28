import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInUserDto {
  @ApiProperty({ example: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'somestrongpassword' })
  @IsString()
  password: string;
}
