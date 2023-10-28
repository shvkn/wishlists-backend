import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class UserPublicResponseDto {
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
    required: false,
    example: ApiPropertiesExamples.User.ABOUT,
  })
  @Length(1, 200)
  @IsString()
  about: string;

  @ApiProperty({
    required: false,
    example: ApiPropertiesExamples.User.AVATAR,
  })
  @IsUrl()
  avatar: string;
}
