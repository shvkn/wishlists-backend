import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ExcludeBlankStringsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    for (const [key, val] of Object.entries(req.body)) {
      if (val === '') {
        delete req.body[key];
      }
    }
    next();
  }
}
