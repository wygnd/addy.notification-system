import { IdentityService } from '@modules/identity/services/service';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

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

    const userId = ctx.from.id.toString();

    // Отправляем запрос в сервис, чтобы узнать, подключался ли пользователь
    const existUser = await this.identityService.checkClientPlatform(userId);

    let message = this.helloText + '\n';

    // Если не нашли пользователя, отправляем приветственное письмо с кнопкой
    if (!existUser.status) {
      const token = ctx.match as string;

      if (!token) {
        await ctx.reply(
          this.helloText +
            '\n' +
            'Чтобы подключить аккаунт, перейдите по ссылке из личного кабинета или введите команду /connect <КОД>',
        );
        return;
      }

      const { status, message: resultMessage } =
        await this.identityService.confirmTokenConnect(userId, token);

      if (status) {
        message += resultMessage;
      } else {
        message += 'Не удалось подключить аккаунт. Попробуйте чуть позже!';
      }
    }

    await ctx.reply(message);
  }
}
