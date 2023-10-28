import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish {
  @ApiProperty({ example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => UserProfileResponseDto })
  @Expose({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

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

  @ApiProperty({
    type: () => Offer,
    isArray: true,
  })
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty({ example: 5 })
  @Column({ default: 0 })
  @Min(0)
  @IsInt()
  copied: number;

  raiseAmount(amount: number) {
    const neededSum = this.price - this.raised;
    if (amount > neededSum) {
      throw new BadRequestException(
        `Сумма взноса не должна превышать ${neededSum}`,
      );
    }
    this.raised = (this.raised || 0) + amount;
  }
}
