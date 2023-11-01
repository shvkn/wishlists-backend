import { BadRequestException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class WishPriceCantBeUpdatedException extends BadRequestException {
  constructor(message: string = ExceptionsMessages.PRICE_CHANGING_NOT_ALLOWED) {
    super(message);
  }
}
