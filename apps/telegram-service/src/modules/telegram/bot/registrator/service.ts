import { TelegramBotStartCommandHandler } from '@modules/telegram/bot';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { ITelegramCommandHandler } from '@modules/telegram/interfaces';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';

@Injectable()
export class TelegramBotRegistrator {
  private readonly logger = new Logger(TelegramBotRegistrator.name);
  private readonly commandHandlerList: ITelegramCommandHandler[] = [];

  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,
    private readonly startHandler: TelegramBotStartCommandHandler,
  ) {
    this.commandHandlerList.push(this.startHandler);
  }

  public register(): void {
    for (const handler of this.commandHandlerList) {
      this.bot.command(handler.command, (ctx) => handler.handle(ctx));
    }
  }
}
