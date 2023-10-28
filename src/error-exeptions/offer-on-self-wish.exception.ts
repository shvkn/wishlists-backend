import { BadRequestException } from '@nestjs/common';

export class OfferOnSelfWishException extends BadRequestException {
  constructor() {
    super(`Нельзя скидываться себе на подарок`);
  }
}
