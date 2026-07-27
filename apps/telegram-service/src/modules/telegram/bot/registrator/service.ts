import { TelegramBotStartCommandHandler } from '@modules/telegram/bot';
import { TelegramBotConnectCommandHandler } from '@modules/telegram/bot/handlers/commands/connect/handler';
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
    private readonly connectHandler: TelegramBotConnectCommandHandler,
  ) {
    this.commandHandlerList.push(this.startHandler);
    this.commandHandlerList.push(this.connectHandler);
  }

  public register(): void {
    for (const handler of this.commandHandlerList) {
      this.bot.command(handler.command, (ctx) => handler.handle(ctx));
    }
  }
}
