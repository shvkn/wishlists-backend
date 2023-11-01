import { NotFoundException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class WishNotFoundException extends NotFoundException {
  constructor(message: string = ExceptionsMessages.WISH_NOT_FOUND) {
    super(message);
  }
}
