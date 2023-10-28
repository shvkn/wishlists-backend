import { NotFoundException } from '@nestjs/common';

export class WishlistNotFoundedException extends NotFoundException {
  constructor(id: number) {
    super(`Вишлист с ID = ${id} не найден`);
  }
}
