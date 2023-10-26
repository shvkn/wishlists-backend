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

import { HashUtilityService } from '../../hash-utility/hash-utility.service';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';

const DefaultValues = {
  AVATAR: 'https://i.pravatar.cc/300',
  ABOUT: 'Пока ничего не рассказал о себе',
};

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  @Length(2, 30)
  username: string;

  @ApiProperty()
  @Column({ default: DefaultValues.ABOUT })
  @Length(2, 200)
  about: string;

  @ApiProperty()
  @Column({ default: DefaultValues.AVATAR })
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiProperty()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  async validatePassword(password: string) {
    return HashUtilityService.verify(password, this.password);
  }
}
