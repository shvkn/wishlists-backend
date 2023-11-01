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
} from 'typeorm';

import { SwaggerExamples } from '../../../utils/swagger.constants';
import { Offer } from '../../offers/entities/offer.entity';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'wishes' })
export class Wish {
  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ type: () => UserProfileResponseDto })
  @Expose({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty({ example: SwaggerExamples.Wish.NAME })
  @IsString()
  @Length(1, 250)
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({ example: SwaggerExamples.Wish.IMAGE })
  @IsUrl()
  @Column({ name: 'link' })
  link: string;

  @ApiProperty({ example: SwaggerExamples.Wish.IMAGE })
  @IsUrl()
  @Column({ name: 'image' })
  image: string;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Column({ name: 'price' })
  price: number;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column({ name: 'raised', default: 0 })
  raised: number;

  @ApiProperty({ example: SwaggerExamples.Wish.DESCRIPTION })
  @IsString()
  @Length(1, 1024)
  @Column({ name: 'description' })
  description: string;

  @ApiProperty({ type: () => Offer, isArray: true })
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @Min(0)
  @IsInt()
  @Column({ name: 'copied', default: 0 })
  copied: number;
}
