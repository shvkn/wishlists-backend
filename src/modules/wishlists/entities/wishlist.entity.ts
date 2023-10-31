import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JoinTable } from 'typeorm';

import { SwaggerExamples } from '../../../utils/swagger.constants';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity({ name: 'wishlists' })
export class Wishlist {
  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: SwaggerExamples.Wishlist.NAME })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: SwaggerExamples.Wishlist.IMAGE })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @ApiProperty({ type: () => Wish })
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
