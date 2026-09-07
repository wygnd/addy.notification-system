import { normalizeError } from '@addy/common';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class ExceptionsToRpcFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsToRpcFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    const { code, message } = normalizeError(exception);

    return throwError(() => ({
      statusCode: code,
      message: message,
      error: exception instanceof Error ? exception.name : 'Error',
    }));
  }
}
