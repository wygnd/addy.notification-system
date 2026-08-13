import { normalizeError } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotConnectCommandHandler implements ITelegramCommandHandler {
  public readonly command = 'connect';

  constructor(private readonly identityService: IdentityService) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id) {
      return;
    }

    const code = ctx.match;

    if (!code || typeof code !== 'string') {
      await ctx.reply('Введите код из личного кабинета: /connect A3F-7D1');
      return;
    }

    console.log('CHECK CODE', code);

    try {
      const verified = await this.identityService.verifyCode(
        ctx.from.id.toString(),
        code,
      );

      if (!verified.status) {
        throw new Error(verified.message);
      }

      await ctx.reply('Аккаунт успешно подключен');
    } catch (error) {
      const { message } = normalizeError(error);

      console.log('BOT CONNECT:', message);

      await ctx.reply(`Не удалось подключить аккаунт`);
    }
  }
}
