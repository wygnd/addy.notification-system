import { IdentityService } from '@modules/identity/services/service';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context, InlineKeyboard } from 'grammy';

@Injectable()
export class TelegramBotStartCommandHandler implements ITelegramCommandHandler {
  readonly command = 'start';
  private readonly helloText = 'Ну приветикс';

  constructor(private readonly identityService: IdentityService) {}

  public async handle(ctx: Context): Promise<void> {
    console.time(`Start receive message: ${ctx.message?.message_id}`);
    if (!ctx.from?.id) {
      await ctx.reply(this.helloText);
      return;
    }

    // Отправляем запрос в сервис, чтобы узнать, подключался ли пользователь
    const existUser = await this.identityService.checkClientPlatform(
      ctx.from.id.toString(),
    );

    // Если нашли, отправляем приветственное письмо без кнопки
    if (existUser.status) {
      await ctx.reply(this.helloText);
      return;
    }

    // todo

    const inlineKeyboard = new InlineKeyboard().text('Авторизация', 'data');

    await ctx.reply(this.helloText, {
      reply_markup: inlineKeyboard,
    });
    console.timeEnd(`Start receive message: ${ctx.message?.message_id}`);
  }
}
