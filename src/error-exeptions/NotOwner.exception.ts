import { NotAcceptableException } from '@nestjs/common';

export class NotOwnerException extends NotAcceptableException {
  constructor() {
    super('Операция разрешена только автору');
  }
}
