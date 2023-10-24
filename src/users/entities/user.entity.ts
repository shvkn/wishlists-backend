import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsUrl, Length } from 'class-validator';

const USER_AVATAR_DEFAULT_VALUE = 'https://i.pravatar.cc/300';
const USER_ABOUT_DEFAULT_VALUE = 'Пока ничего не рассказал о себе';

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

  @Column({ default: USER_ABOUT_DEFAULT_VALUE })
  @Length(2, 200)
  about: string;

  @Column({ default: USER_AVATAR_DEFAULT_VALUE })
  @IsUrl()
  avatar: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;
}
