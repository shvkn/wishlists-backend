import { NotAcceptableException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class YouShouldBeOwnerException extends NotAcceptableException {
  constructor(message: string = ExceptionsMessages.YOU_SHOULD_BE_OWNER) {
    super(message);
  }
}
