import { NotFoundException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class OfferNotFoundException extends NotFoundException {
  constructor(message: string = ExceptionsMessages.OFFER_NOT_FOUND) {
    super(message);
  }
}
