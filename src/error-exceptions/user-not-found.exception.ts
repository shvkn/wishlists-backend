import { NotFoundException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class UserNotFoundException extends NotFoundException {
  constructor(message: string = ExceptionsMessages.USER_NOT_FOUND) {
    super(message);
  }
}
