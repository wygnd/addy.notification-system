import { IdentityService } from '@modules/identity/services/service';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context, InlineKeyboard } from 'grammy';

@Injectable()
export class TelegramBotStartCommandHandler implements ITelegramCommandHandler {
  public readonly command = 'start';
  private readonly helloText = 'Ну приветикс';

  constructor(private readonly identityService: IdentityService) {}

  public async handle(ctx: Context): Promise<void> {
    if (!ctx.from?.id) {
      await ctx.reply(this.helloText);
      return;
    }

    // Отправляем запрос в сервис, чтобы узнать, подключался ли пользователь
    const existUser = await this.identityService.checkClientPlatform(
      ctx.from.id.toString(),
    );

    let inlineKeyboard: InlineKeyboard | undefined = undefined;

    // Если не нашли пользователя, отправляем приветственное письмо с кнопкой
    if (!existUser.status) {
      inlineKeyboard = new InlineKeyboard().text('Авторизация', 'data');
    }

    await ctx.reply(this.helloText, {
      reply_markup: inlineKeyboard,
    });
  }
}
