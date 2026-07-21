import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';

@Injectable()
export class VkProvider implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(VK_RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
