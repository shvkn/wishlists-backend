import { BadRequestException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class CantOfferSelfWishException extends BadRequestException {
  constructor(message: string = ExceptionsMessages.CANT_OFFER_YOUR_WISH) {
    super(message);
  }
}
