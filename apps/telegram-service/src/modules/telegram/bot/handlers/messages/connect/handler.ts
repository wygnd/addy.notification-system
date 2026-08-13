import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS } from '@modules/telegram/constants';
import { ITelegramMessageHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotConnectMessageHandler implements ITelegramMessageHandler {
  public readonly pattern = TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS.CLIENT_CONNECT;

  constructor(private readonly redisService: RedisService) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id) {
      return;
    }

    await this.redisService.set<boolean>(
      REDIS_KEYS.CLIENT_CONNECT_START + ctx.from.id,
      true,
      600, // 10 minutes
    );

    await ctx.reply('Введите код');
  }
}
