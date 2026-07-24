import { INotificationResultMap, NotificationResultEnum } from '@addy/common';
import { NOTIFICATION_RABBITMQ_SERVICE_RESULT } from '@modules/vk/constants/constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VkNotificationProvider implements OnModuleInit, OnModuleDestroy {
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

  public async emit<T extends NotificationResultEnum>(
    pattern: T,
    data: INotificationResultMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }
}
