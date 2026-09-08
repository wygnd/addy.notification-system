import {
  IVkEventEmitMap,
  IVkSendMessageMap,
  IVkSendMessageResponseMap,
  VkEmitPatternEnum,
  VkSendPatternEnum,
} from '@addy/common';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

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

  /**
   * Отправляет запрос, ожидая ответа
   * @param {string} pattern
   * @param {unknown} data
   * @param {number} timeoutMs - Количество миллисекунд, которые готовы ждать, чтобы получить ответ
   */
  public async send<T, U extends VkSendPatternEnum>(
    pattern: U,
    data: IVkSendMessageMap[U],
    timeoutMs = 10_000,
  ): Promise<IVkSendMessageResponseMap[U]> {
    return firstValueFrom(
      this.client.send<IVkSendMessageResponseMap[U]>(pattern, data).pipe(
        timeout(timeoutMs),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
