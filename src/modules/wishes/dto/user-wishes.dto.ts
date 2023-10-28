import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';

export class UserWishesDto {
  @ApiProperty({ example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'name' })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: 'https://market.yandex.ru/some' })
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({ example: 'https://market.yandex.ru/img' })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({ example: 1000.43 })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty({ example: 400.33 })
  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ApiProperty({ example: 'some description' })
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiProperty({ type: () => Offer, isArray: true })
  offers: Offer[];
}
