import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsUrl, Length } from 'class-validator';
import { HashUtilityService } from '../../hash-utility/hash-utility.service';

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
  @IsEmail()
  email: string;

  @Column()
  password: string;

  async validatePassword(password: string) {
    return HashUtilityService.verify(password, this.password);
  }
}
