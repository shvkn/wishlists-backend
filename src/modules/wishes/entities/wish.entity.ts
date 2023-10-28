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

import { IncorrectAmountException } from '../../../error-exeptions/incorrect-amount.exception';
import { ApiPropertiesExamples } from '../../../utils/constants';
import { Offer } from '../../offers/entities/offer.entity';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish {
  @ApiProperty({ example: ApiPropertiesExamples.Common.ID })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => UserProfileResponseDto })
  @Expose({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty({ example: ApiPropertiesExamples })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: ApiPropertiesExamples.Wish.IMAGE })
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({ example: ApiPropertiesExamples.Wish.IMAGE })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({ example: ApiPropertiesExamples.Common.CURRENCY })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty({ example: ApiPropertiesExamples.Common.CURRENCY })
  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ApiProperty({ example: ApiPropertiesExamples.Wish.DESCRIPTION })
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

  @ApiProperty({ example: ApiPropertiesExamples.Common.ID })
  @Column({ default: 0 })
  @Min(0)
  @IsInt()
  copied: number;

  raiseAmount(amount: number) {
    const neededSum = this.price - this.raised;
    if (amount > neededSum) {
      throw new IncorrectAmountException(
        `Сумма взноса не должна превышать ${neededSum}`,
      );
    }
    this.raised += amount;
  }

  increaseCopied() {
    this.copied += 1;
  }
}
