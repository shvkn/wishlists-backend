import { NotFoundException } from '@nestjs/common';

export class OfferNotFoundedException extends NotFoundException {
  constructor(id: number) {
    super(`Оффер с ID = ${id} не найден`);
  }
}
