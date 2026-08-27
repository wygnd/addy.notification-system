import { normalizeError } from '@addy/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export class TransformErrorFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(TransformErrorFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const { code, statusCode, message } = normalizeError(exception);

    if (statusCode >= 500) {
      this.logger.fatal(exception);
    }

    response.status(statusCode).send({
      ok: false,
      err_code: code,
      err_detail: message,
      timestamp: new Date().toISOString(),
    });
  }
}
