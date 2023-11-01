import { OmitType } from '@nestjs/swagger';

import { CreateUserResponseDto } from '../../users/dto/create-user-response.dto';

export class SignUpUserResponseDto extends OmitType(CreateUserResponseDto, [
  'password',
] as const) {}
