import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsInt()
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
