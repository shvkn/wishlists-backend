import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @ApiProperty({ example: 5 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T05:54:49.597Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Wish })
  @ManyToOne(() => Wish)
  item: Wish;

  @ApiProperty({ example: 55.55 })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  hidden: boolean;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  user: User;
}
