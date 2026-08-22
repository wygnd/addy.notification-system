import { IdentityService } from '@modules/identity/services/service';
import { buildMainKeyboard } from '@modules/telegram/builderd';
import { TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS } from '@modules/telegram/constants';
import { ITelegramMessageHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotDisconnectMessageHandler implements ITelegramMessageHandler {
  public readonly pattern =
    TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS.CLIENT_DISCONNECT;

  constructor(private readonly identityService: IdentityService) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id) {
      return;
    }

    console.log('HANDLE DISCONNECT');

    let message: string;
    const disconnectResult = await this.identityService.disconnectClient(
      ctx.from.id.toString(),
    );

    if (disconnectResult) {
      message = 'Аккаунт успешно отключен';
    } else {
      console.log('DISCONNECT ERROR', disconnectResult);
      message = 'Что-то пошло не так. Попробуйте позже';
    }

    await ctx.reply(message, {
      reply_markup: buildMainKeyboard(false),
    });
  }
}
