import { TelegramBotRegistrator } from '@modules/telegram/bot';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { Inject, Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
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
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const useWebhook =
      this.configService.getOrThrow<string>('TELEGRAM_USE_WEBHOOK') === 'true';

    this.bot.catch((err) => {
      console.log(err);
      this.logger.error(`Bot error: ${err.message}`);
    });

    this.telegramBotRegistrator.register();

    if (useWebhook) {
      const webhookURL = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHOOK_URL',
      );
      const webhookSecret = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHOOK_SECRET',
      );

      const webhookIpAddress = this.configService.getOrThrow<string>(
        'TELEGRAM_WEBHHOK_IP_ADDRESS',
      );

      await this.bot.api.setWebhook(webhookURL, {
        secret_token: webhookSecret,
        ip_address: webhookIpAddress,
      });
    } else {
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
