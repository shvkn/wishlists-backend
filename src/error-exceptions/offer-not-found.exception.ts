import { NotFoundException } from '@nestjs/common';

export class OfferNotFoundException extends NotFoundException {
  constructor() {
    super(`Оффер не найден`);
  }
}
