import { ApiProperty } from '@nestjs/swagger';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class SignInUserResponseDto {
  @ApiProperty({
    example: SwaggerExamples.Common.JWT_TOKEN,
  })
  access_token: string;
}
