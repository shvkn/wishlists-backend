import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class User {
  @ApiProperty({ example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'username' })
  @Column()
  @Length(2, 30)
  username: string;

  @ApiProperty({ example: 'Пока ничего не рассказал о себе' })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @ApiProperty({ example: 'user@yandex.ru' })
  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ type: () => Wish, isArray: true })
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty({ type: () => Offer, isArray: true })
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
