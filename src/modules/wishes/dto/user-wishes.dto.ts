import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SwaggerExamples } from '../../../utils/swagger.constants';
import { Offer } from '../../offers/entities/offer.entity';

export class UserWishesDto {
  @ApiProperty({ example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: SwaggerExamples.Wish.NAME })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: SwaggerExamples.Wish.LINK })
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({ example: SwaggerExamples.Wish.IMAGE })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ApiProperty({ example: SwaggerExamples.Wish.DESCRIPTION })
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiProperty({ type: () => Offer, isArray: true })
  offers: Offer[];
}
