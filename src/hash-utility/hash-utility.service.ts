import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashUtilityService {
  static async verify(plainPassword: string, hash: string) {
    return argon2.verify(hash, plainPassword);
  }

  static async hash(plainPassword) {
    return argon2.hash(plainPassword);
  }
}
