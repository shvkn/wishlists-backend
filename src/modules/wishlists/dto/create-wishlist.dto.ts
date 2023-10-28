import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

import { ApiPropertiesExamples } from '../../../utils/constants';

export class CreateWishlistDto {
  @ApiProperty({
    example: ApiPropertiesExamples.Wishlist.IMAGE,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    example: ApiPropertiesExamples.Wishlist.IMAGE,
  })
  @IsUrl()
  image: string;
  @ApiProperty({
    example: ApiPropertiesExamples.Common.IDS_LIST,
  })
  @IsNumber({}, { each: true })
  itemsId: number[];
}
