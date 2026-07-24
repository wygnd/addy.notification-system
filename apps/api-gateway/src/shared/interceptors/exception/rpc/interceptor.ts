import { isRpcError } from '@addy/common';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, TimeoutError } from 'rxjs';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        throw this.normalizeError(err);
      }),
    );
  }

  private normalizeError(error: unknown): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error instanceof TimeoutError) {
      return new HttpException('Service Timeout', HttpStatus.GATEWAY_TIMEOUT);
    }

    if (isRpcError(error)) {
      return new HttpException(error.message, error.statusCode);
    }

    return new InternalServerErrorException('Unexpected error');
  }
}
