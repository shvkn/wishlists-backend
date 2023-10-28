import { BadRequestException } from '@nestjs/common';

export class PriceChangingIsNotAllowedException extends BadRequestException {
  constructor() {
    super('Нельзя изменять стоимость, если уже есть желающие скинуться');
  }
}
