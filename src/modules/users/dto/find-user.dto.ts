import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class FindUserDto {
  @ApiProperty({
    example: SwaggerExamples.Common.QUERY,
  })
  @IsString()
  @MinLength(1)
  query: string;
}
