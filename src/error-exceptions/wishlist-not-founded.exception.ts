import { NotFoundException } from '@nestjs/common';

export class WishlistNotFoundedException extends NotFoundException {
  constructor() {
    super(`Вишлист не найден`);
  }
}
