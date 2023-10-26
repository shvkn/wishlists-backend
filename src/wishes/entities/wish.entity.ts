import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsInt, IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wish {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty()
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty()
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty()
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty()
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty()
  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ApiProperty()
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiProperty()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty()
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
    this.raised += amount;
  }
}
