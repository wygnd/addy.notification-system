import { AppException, ErrorCodeEnum } from '@addy/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyReply>();

    const [, requestToken] = (request.headers['authorization'] as string).split(
      ' ',
    );
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
  }
}
