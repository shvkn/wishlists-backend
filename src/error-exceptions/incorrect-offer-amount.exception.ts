import { NotAcceptableException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class IncorrectOfferAmountException extends NotAcceptableException {
  constructor(message: string = ExceptionsMessages.INCORRECT_OFFER_AMOUNT) {
    super(message);
  }
}
