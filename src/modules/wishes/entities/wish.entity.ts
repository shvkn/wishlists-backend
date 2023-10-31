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
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: SwaggerExamples.Common.DATE })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => UserProfileResponseDto })
  @Expose({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty({ example: SwaggerExamples })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({ example: SwaggerExamples.Wish.IMAGE })
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({ example: SwaggerExamples.Wish.IMAGE })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @ApiProperty({ example: SwaggerExamples.Common.CURRENCY })
  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @ApiProperty({ example: SwaggerExamples.Wish.DESCRIPTION })
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiProperty({
    type: () => Offer,
    isArray: true,
  })
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty({ example: SwaggerExamples.Common.ID })
  @Column({ default: 0 })
  @Min(0)
  @IsInt()
  copied: number;
}
