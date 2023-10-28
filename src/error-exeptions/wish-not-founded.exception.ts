import { NotFoundException } from '@nestjs/common';

export class WishNotFoundedException extends NotFoundException {
  constructor(id: number) {
    super(`Подарок с ID = ${id} не найден`);
  }
}
