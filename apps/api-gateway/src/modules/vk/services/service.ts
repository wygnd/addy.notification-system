import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';

@Injectable()
export class VkService {
  constructor(
    @Inject(VK_RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  public async sendMessage() {}
}
