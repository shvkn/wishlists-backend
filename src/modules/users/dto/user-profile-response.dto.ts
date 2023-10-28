import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class UserProfileResponseDto {
  @ApiProperty({ example: ApiPropertiesExamples.Common.ID })
  id: number;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  createdAt: Date;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  updatedAt: Date;

  @ApiProperty({
    example: ApiPropertiesExamples.User.USERNAME,
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: ApiPropertiesExamples.User.EMAIL,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    example: ApiPropertiesExamples.User.ABOUT,
  })
  @Length(1, 200)
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({
    required: false,
    example: ApiPropertiesExamples.User.AVATAR,
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
