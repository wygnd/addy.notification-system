import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';
import { firstValueFrom } from 'rxjs';
import { VkPatternEnum } from '@modules/vk/enums';
import { IVkEventEmitMap } from '@modules/vk/interfaces';

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

  public async emit<T extends VkPatternEnum>(
    pattern: T,
    data: IVkEventEmitMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }
}
