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

import { SwaggerExamples } from '../../../utils/swagger.constants';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ example: 'username' })
  @Length(2, 30)
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: SwaggerExamples.User.ABOUT })
  @Length(2, 200)
  @IsOptional()
  @IsNotEmpty()
  @Column({ name: 'about', default: 'Пока ничего не рассказал о себе' })
  about?: string;

  @ApiProperty({ example: SwaggerExamples.User.AVATAR })
  @IsUrl()
  @IsOptional()
  @IsNotEmpty()
  @Column({ name: 'avatar', default: 'https://i.pravatar.cc/300' })
  avatar?: string;

  @ApiProperty({ example: SwaggerExamples.User.EMAIL })
  @IsEmail()
  @IsNotEmpty()
  @Column({ name: 'email', unique: true })
  email: string;

  @ApiProperty({ example: SwaggerExamples.User.PASSWORD })
  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @Column({ name: 'password' })
  password: string;

  @ApiProperty({ type: () => Wish, isArray: true })
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty({ type: () => Offer, isArray: true })
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
