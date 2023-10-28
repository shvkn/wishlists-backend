import { ConflictException } from '@nestjs/common';

export class UserExistsException extends ConflictException {
  constructor() {
    super(`Пользователь с таким email или username уже зарегистрирован`);
  }
}
