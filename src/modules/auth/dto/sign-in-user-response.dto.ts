import { ApiProperty } from '@nestjs/swagger';

export class SignInUserResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNodmtuIiwiaWF0IjoxNjk4MzIyMzE1LCJleHAiOjE3MDM1MDYzMTV9.oCSZJ5PzVzAD9PAcoznR7PqrKZZhrPmjVWFEJD4MRwg',
  })
  access_token: string;
}
