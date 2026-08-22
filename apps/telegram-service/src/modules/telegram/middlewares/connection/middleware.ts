import { normalizeError } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { buildMainKeyboard } from '@modules/telegram/builderd';
import { Injectable } from '@nestjs/common';
import { Context, NextFunction } from 'grammy';

@Injectable()
export class TelegramConnectionMiddleware {
  constructor(
    private readonly identityService: IdentityService,
    private readonly redisService: RedisService,
  ) {}

  public middleware() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.from) {
        return next();
      }

      const userId = ctx.from.id.toString();
      const isConnected = await this.isUserConnected(userId);

      // Если пользователь подключен - пропускаем
      if (isConnected) {
        return next();
      }

      await this.handleUnconnected(ctx, userId);
    };
  }

  private async handleUnconnected(ctx: Context, userId: string): Promise<void> {
    const token = ctx.match as string | undefined;

    // Если есть код, пытаемся подключить пользователя
    if (token) {
      let message = '✅ Аккаунт подключен!';

      const { status, message: confirmTokenMessageResult } =
        await this.identityService.confirmTokenConnect(userId, token);

      if (!status) {
        message = '❌ ' + confirmTokenMessageResult;
      }

      await ctx.reply(message);

      return;
    }

    if (ctx.message?.text && !ctx.message.text.startsWith('/')) {
      await this.maybeConfirmCode(ctx, userId, ctx.message.text);
      return;
    }

    await ctx.reply(
      'Чтобы пользоваться ботом, подключите аккаунт:\n\n' +
        '1. Перейдите по ссылке из личного кабинета, либо\n' +
        '2. Введите код подключения прямо сюда сообщением',
    );
  }

  private async maybeConfirmCode(
    ctx: Context,
    userId: string,
    code: string,
  ): Promise<void> {
    try {
      const { status, message } = await this.identityService.verifyCode(
        userId,
        code,
      );

      if (!status) {
        throw new Error(message);
      }

      await ctx.reply('✅ Аккаунт подключён!', {
        reply_markup: buildMainKeyboard(true),
      });
    } catch (error) {
      const { message } = normalizeError(error);

      await ctx.reply(
        `❌ ${message}\n\n` +
          'Попробуйте снова или перейдите по ссылке из кабинета.',
        {
          reply_markup: buildMainKeyboard(false),
        },
      );
    }
  }

  private async isUserConnected(userId: string): Promise<boolean> {
    const isConnectedRedisKey = REDIS_KEYS.IS_CLIENT_CONNECTED + userId;

    const isConnectedCached =
      await this.redisService.get<string>(isConnectedRedisKey);

    if (isConnectedCached) {
      return isConnectedCached == '1';
    }

    const { status } = await this.identityService.checkClientPlatform(userId);

    await this.redisService.set<string>(
      isConnectedRedisKey,
      status ? '1' : '0',
      300,
    );

    return status;
  }
}
