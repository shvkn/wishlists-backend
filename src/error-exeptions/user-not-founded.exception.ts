import { NotFoundException } from '@nestjs/common';

export class UserNotFoundedException extends NotFoundException {
  constructor() {
    super(`Пользователь с таким email или username не найден`);
  }
}
