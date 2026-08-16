import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';

export class TelegramWebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as FastifyReply;

    const secretToken = this.configService.get<string>(
      'TELEGRAM_WEBHOOK_SECRET',
    );

    const headerToken = request.headers['x-telegram-bot-api-secret-token'];

    if (!headerToken || headerToken !== secretToken) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
