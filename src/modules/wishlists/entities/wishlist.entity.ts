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
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ example: SwaggerExamples.Wishlist.NAME })
  @IsString()
  @Length(1, 250)
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({ example: SwaggerExamples.Wishlist.IMAGE })
  @IsUrl()
  @Column({ name: 'image' })
  image: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ApiProperty({ type: () => Wish })
  @ManyToMany(() => Wish)
  @JoinTable({ name: 'wishlists_items_wishes' })
  items: Wish[];
}
