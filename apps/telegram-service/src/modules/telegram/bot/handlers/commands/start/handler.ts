import { IdentityService } from '@modules/identity/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { TelegramBotMenuConnectService } from '@modules/telegram/bot/menu/connect';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';

@Injectable()
export class TelegramBotStartCommandHandler implements ITelegramCommandHandler {
  public readonly command = 'start';
  private readonly helloText = 'Ну приветикс';

  constructor(
    private readonly identityService: IdentityService,
    private readonly redisService: RedisService,
    private readonly menuConnectHandler: TelegramBotMenuConnectService,
  ) {}

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

      if (token) {
        const { status, message: resultMessage } =
          await this.identityService.confirmTokenConnect(userId, token);

        if (status) {
          message += resultMessage;
        } else {
          console.log('Error auto connecting', resultMessage);

          message +=
            'Чтобы подключить аккаунт, отправьте код из личного кабинета ADDY';
          await this.redisService.set<boolean>(
            REDIS_KEYS.CLIENT_CONNECT_START + ctx.from.id,
            true,
            600, // 10 minutes
          );
        }
      }
    }

    await ctx.reply(message, {
      reply_markup: this.menuConnectHandler.getConnectMenu(),
    });
  }
}
