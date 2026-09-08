import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(HttpLoggerMiddleware.name)
    private readonly logger: PinoLogger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {}
}
