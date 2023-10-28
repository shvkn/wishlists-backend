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

import { ApiPropertiesExamples } from '../../../utils/constants';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @ApiProperty({ example: ApiPropertiesExamples.Common.ID })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: ApiPropertiesExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Wish })
  @ManyToOne(() => Wish)
  item: Wish;

  @ApiProperty({ example: ApiPropertiesExamples.Common.CURRENCY })
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
