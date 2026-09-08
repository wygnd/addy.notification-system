import {
  ITelegramEventEmitMap,
  ITelegramSendMessageMap,
  ITelegramSendMessageResponseMap,
  TelegramEmitPatternEnum,
  TelegramSendPatternEnum,
} from '@addy/common';
import { TELEGRAM_RABBITMQ_SERVICE } from '@modules/telegram/constants/constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class TelegramProvider implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(TELEGRAM_RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  public async emit<T extends TelegramEmitPatternEnum>(
    pattern: T,
    data: ITelegramEventEmitMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }

  public async send<T extends TelegramSendPatternEnum>(
    pattern: T,
    data: ITelegramSendMessageMap[T],
    timeoutMs = 10_000,
  ): Promise<ITelegramSendMessageResponseMap[T]> {
    return firstValueFrom(
      this.client.send<ITelegramSendMessageResponseMap[T]>(pattern, data).pipe(
        timeout(timeoutMs),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
