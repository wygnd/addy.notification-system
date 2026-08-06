import { normalizeError } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotDisconnectCommandHandler implements ITelegramCommandHandler {
  public readonly command = 'disconnect';

  constructor(private readonly identityService: IdentityService) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id) {
      return;
    }

    try {
      const result = await this.identityService.disconnectClient(
        ctx.from.id.toString(),
      );

      if (!result.status) {
        throw new Error(result.message);
      }

      await ctx.reply('Вы отключили аккаунт от уведомлений');
    } catch (error) {
      const { message } = normalizeError(error);

      console.log('BOT DISCONNECT:', message);

      await ctx.reply('Не удалось отключить аккаунт');
    }
  }
}
