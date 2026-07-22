import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { VkEmitPatternEnum, VkSendPatternEnum } from '@modules/vk/enums';
import { IVkEventEmitMap, IVkSendMessageMap } from '@modules/vk/interfaces';

@Injectable()
export class VkProvider implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(VK_RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  public async emit<T extends VkEmitPatternEnum>(
    pattern: T,
    data: IVkEventEmitMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }

  public async send<T, U extends VkSendPatternEnum>(
    pattern: U,
    data: IVkSendMessageMap[U],
  ): Promise<T> {
    return firstValueFrom(
      this.client.send<T>(pattern, data).pipe(
        timeout(10_000),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
