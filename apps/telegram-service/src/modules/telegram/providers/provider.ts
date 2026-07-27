import { INotificationResultMap, NotificationResultEnum } from '@addy/common';
import { NOTIFICATION_RABBITMQ_SERVICE_RESULT } from '@modules/telegram/constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramNotificationProvider
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(NOTIFICATION_RABBITMQ_SERVICE_RESULT)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  private async emit<T extends NotificationResultEnum>(
    pattern: T,
    data: INotificationResultMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }

  public async sendMessageResult(
    data: INotificationResultMap[NotificationResultEnum.SEND_RESULT],
  ): Promise<void> {
    return this.emit(NotificationResultEnum.SEND_RESULT, data);
  }
}
