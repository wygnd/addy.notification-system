import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { normalizeError } from '@shared/utils';

@Catch()
export class ExceptionsToRpcFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
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
