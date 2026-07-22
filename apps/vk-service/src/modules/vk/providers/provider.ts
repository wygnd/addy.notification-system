import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_RABBITMQ_SERVICE_RESULT } from '@modules/vk/constants/constants';
import { firstValueFrom } from 'rxjs';
import { INotificationEmitMap } from '@shared/interfaces';
import { NotificationPatternEnum } from '@shared/enums';

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

  public async emit<T extends NotificationPatternEnum>(
    pattern: T,
    data: INotificationEmitMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }
}
