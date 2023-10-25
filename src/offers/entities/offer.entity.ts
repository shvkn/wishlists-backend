import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsNumber, Min } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Wish)
  @JoinColumn()
  item: Wish;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
