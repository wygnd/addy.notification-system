import { ITelegramEventEmitMap, TelegramEmitPatternEnum } from '@addy/common';
import { TelegramProvider } from '@modules/telegram/providers/provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  constructor(private readonly telegramProvider: TelegramProvider) {}

  private async emitEvent<
    T extends TelegramEmitPatternEnum = TelegramEmitPatternEnum,
  >(pattern: T, data: ITelegramEventEmitMap[T]): Promise<void> {
    return this.telegramProvider.emit(pattern, data);
  }

  public async sendMessage(
    data: ITelegramEventEmitMap[TelegramEmitPatternEnum.SEND_MESSAGE],
  ): Promise<void> {
    return this.emitEvent(TelegramEmitPatternEnum.SEND_MESSAGE, data);
  }
}
