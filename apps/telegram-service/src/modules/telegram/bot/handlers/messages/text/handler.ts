import { normalizeError } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { ITelegramMessageHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotTextMessageHandler implements ITelegramMessageHandler {
  public readonly pattern = 'message:text';

  constructor(
    private readonly redisService: RedisService,
    private readonly identityService: IdentityService,
  ) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id || !ctx.message?.text) {
      return;
    }

    const isConnectingRedisKey = REDIS_KEYS.CLIENT_CONNECT_START + ctx.from.id;

    const isConnecting =
      await this.redisService.get<boolean>(isConnectingRedisKey);

    if (isConnecting) {
      try {
        const verified = await this.identityService.verifyCode(
          ctx.from.id.toString(),
          ctx.message.text,
        );

        if (!verified.status) {
          throw new Error(verified.message);
        }

        await ctx.reply('Аккаунт успешно подключен');
      } catch (error) {
        const { message } = normalizeError(error);

        await ctx.reply(`Не удалось подключить аккаунт.\n\n` + message);
      } finally {
        await this.redisService.del(isConnectingRedisKey);
      }
    }
  }
}
