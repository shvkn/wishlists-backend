import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsUrl, Length } from 'class-validator';
import { HashUtilityService } from '../../hash-utility/hash-utility.service';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Exclude } from 'class-transformer';

const DefaultValues = {
  AVATAR: 'https://i.pravatar.cc/300',
  ABOUT: 'Пока ничего не рассказал о себе',
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(2, 30)
  username: string;

  @Column({ default: DefaultValues.ABOUT })
  @Length(2, 200)
  about: string;

  @Column({ default: DefaultValues.AVATAR })
  @IsUrl()
  avatar: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  async validatePassword(password: string) {
    return HashUtilityService.verify(password, this.password);
  }
}
