import { VK_API_SERVICE } from '@modules/vk/constants';
import { type IVkApiPort } from '@modules/vk/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { VK_SERVICE_SEND_MESSAGE_LIMIT_ITEMS } from '@shared/constants';
import Bottleneck from 'bottleneck';

@Injectable()
export class VkMessageService {
  private readonly limiter = new Bottleneck({
    reservoir: VK_SERVICE_SEND_MESSAGE_LIMIT_ITEMS, // Доступно на старте
    reservoirRefreshAmount: VK_SERVICE_SEND_MESSAGE_LIMIT_ITEMS, // Пополнять до
    reservoirRefreshInterval: 1000, // Каждую секунду
    maxConcurrent: VK_SERVICE_SEND_MESSAGE_LIMIT_ITEMS,
  });

  constructor(
    @Inject(VK_API_SERVICE)
    private readonly vkApi: IVkApiPort,
  ) {}

  public async sendMessage(
    userId: string | number,
    message: string,
  ): Promise<void> {
    await this.limiter.schedule(() => this.vkApi.sendMessage(userId, message));
  }
}
