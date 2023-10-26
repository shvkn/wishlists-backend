import {
  IsNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishDto {
  @ApiProperty()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty()
  @IsString()
  @MaxLength(1500)
  description: string;
}
