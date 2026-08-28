import { AppException, ErrorCodeEnum } from '@addy/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    @InjectPinoLogger(AuthGuard.name)
    private readonly logger: PinoLogger,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<FastifyReply>();

      const authorization = request.headers['authorization'];

      if (!authorization || typeof authorization !== 'string') {
        throw new AppException(ErrorCodeEnum.FORBIDDEN);
      }

      const [, requestToken] = authorization.split(' ');

      const username = this.configService.get<string>('API_AUTH_USERNAME');
      const password = this.configService.get<string>('API_AUTH_PASSWORD');

      if (!requestToken || !username || !password) {
        throw new AppException(ErrorCodeEnum.FORBIDDEN);
      }

      const token = btoa(`${username}:${password}`);

      if (requestToken !== token) {
        throw new AppException(ErrorCodeEnum.FORBIDDEN);
      }

      return true;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
