import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

import { SwaggerExamples } from '../../../utils/swagger.constants';

export class CreateWishlistDto {
  @ApiProperty({
    example: SwaggerExamples.Wishlist.IMAGE,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    example: SwaggerExamples.Wishlist.IMAGE,
  })
  @IsUrl()
  image: string;
  @ApiProperty({
    example: SwaggerExamples.Common.IDS_LIST,
  })
  @IsNumber({}, { each: true })
  itemsId: number[];
}
