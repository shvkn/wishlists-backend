import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class FindUserDto {
  @ApiProperty({
    example: ApiPropertiesExamples.Common.QUERY,
  })
  @IsString()
  @MinLength(1)
  query: string;
}
