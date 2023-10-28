import { ApiProperty } from '@nestjs/swagger';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class SignInUserResponseDto {
  @ApiProperty({
    example: ApiPropertiesExamples.Common.JWT_TOKEN,
  })
  access_token: string;
}
