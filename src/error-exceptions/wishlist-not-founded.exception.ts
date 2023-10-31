import { NotFoundException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class WishlistNotFoundedException extends NotFoundException {
  constructor(message: string = ExceptionsMessages.WISHLIST_NOT_FOUND) {
    super(message);
  }
}
