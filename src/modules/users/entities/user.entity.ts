import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiPropertiesExamples } from '../../../utils/constants';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: ApiPropertiesExamples.Common.ID })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'username' })
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.ABOUT })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  @IsNotEmpty()
  about?: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.AVATAR })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  avatar?: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.EMAIL })
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: ApiPropertiesExamples.User.PASSWORD })
  @Column()
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: () => Wish, isArray: true })
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty({ type: () => Offer, isArray: true })
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
