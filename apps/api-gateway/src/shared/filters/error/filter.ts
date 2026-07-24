import { normalizeError } from '@addy/common';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class TransformErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(TransformErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const { code, message } = normalizeError(exception);

    response.status(code).send({
      ok: false,
      err_code: code, // fixme
      err_detail: message,
      timestamp: new Date().toISOString(),
    });
  }
}
