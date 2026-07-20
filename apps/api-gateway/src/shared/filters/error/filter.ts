import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class TransformErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(TransformErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse() as FastifyReply;

    response.status(response.statusCode).send({
      ok: false,
      err_code: 'Error', // fixme
      err_detail: 'Coming soon', // fixme
      timestamp: new Date().toISOString(),
    });
  }
  private isGrpcError(
    exception: unknown,
  ): exception is { code: number; details: string } {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      'details' in exception
    );
  }
}
