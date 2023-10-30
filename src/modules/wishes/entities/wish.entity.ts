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
  VirtualColumn,
} from 'typeorm';

import { ApiPropertiesExamples } from '../../../utils/constants';
import { Offer } from '../../offers/entities/offer.entity';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'wishes' })
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
  @VirtualColumn({
    query: (alias) =>
      `SELECT ROUND(SUM("amount"), 2) FROM "offers" WHERE "itemId" = ${alias}.id`,
  })
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

  increaseCopied() {
    this.copied = (this.copied || 0) + 1;
  }
}
