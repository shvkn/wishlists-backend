import { NotFoundException } from '@nestjs/common';

export class WishNotFoundException extends NotFoundException {
  constructor() {
    super(`Подарок не найден`);
  }
}
