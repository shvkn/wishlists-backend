import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SwaggerExamples } from '../../../utils/swagger.constants';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'offers' })
export class Offer {
  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ type: () => Wish })
  @ManyToOne(() => Wish)
  item: Wish;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Column({ name: 'amount' })
  amount: number;

  @ApiProperty({ example: false })
  @Column({ name: 'hidden', default: false })
  hidden: boolean;

  @ApiProperty({ type: () => User })
  @Transform((params) => (params.obj.hidden ? '' : params.obj.user))
  @ManyToOne(() => User)
  user: User;
}
