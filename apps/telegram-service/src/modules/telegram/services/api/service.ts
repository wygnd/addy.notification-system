import { TelegramBotRegistrator } from '@modules/telegram/bot';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { TelegramConnectionMiddleware } from '@modules/telegram/middlewares';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';

@Injectable()
export class TelegramBotApiService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(TelegramBotApiService.name);

  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,
    private readonly configService: ConfigService,
    private readonly telegramBotRegistrator: TelegramBotRegistrator,
    private readonly telegramConnectionMiddleware: TelegramConnectionMiddleware,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const useWebhook =
      this.configService.getOrThrow<string>('TELEGRAM_USE_WEBHOOK') === 'true';

    this.bot.catch(async (err) => {
      this.logger.fatal(`Bot error: ${err.message}`);

      await err.ctx.reply('Произошла непредвиденная ошибка :(');
    });

    this.bot.use(this.telegramConnectionMiddleware.middleware());

    // Регистрируем динамическое меню
    this.telegramBotRegistrator.registerMenu();

    // Регистрируем обработчики команд и сообщений
    this.telegramBotRegistrator.register();

    // Если используется webhook
    if (useWebhook) {
      const webhookURL = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHOOK_URL',
      );
      const webhookSecret = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHOOK_SECRET',
      );

      const webhookIpAddress = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHOOK_IP_ADDRESS',
      );

      await this.bot.api.setWebhook(webhookURL, {
        secret_token: webhookSecret,
        ip_address: webhookIpAddress,
      });
    }
    // Обычный метод
    else {
      // await this.bot.api.deleteWebhook();
      await this.bot.start({
        onStart: (info) => {
          this.logger.verbose(`Bot started: ${info.id}`);
        },
      });
    }
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.bot.isRunning()) {
      await this.bot.stop();
    }
  }

  public async sendMessage(chatId: string, message: string) {
    return this.bot.api.sendMessage(chatId, message);
  }
}
