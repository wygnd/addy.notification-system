import { normalizeError } from '@addy/common';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class TransformErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(TransformErrorFilter.name);

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
