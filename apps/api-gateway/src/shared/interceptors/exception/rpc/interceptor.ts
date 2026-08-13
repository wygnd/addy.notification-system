import { AppException, ErrorCodeEnum } from '@addy/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
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
        if (err instanceof TimeoutError) {
          throw new AppException(ErrorCodeEnum.SERVICE_TIMEOUT);
        }

        throw err;
      }),
    );
  }
}
