import { buildMainKeyboard } from '@modules/telegram/builderd';
import { ITelegramMessageHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotTextMessageHandler implements ITelegramMessageHandler {
  public readonly pattern = 'message:text';

  constructor() {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id || !ctx.message?.text) {
      return;
    }

    await ctx.reply('Здесь потом что-то будет', {
      reply_markup: buildMainKeyboard(true),
    });
  }
}
