import { Inject, Injectable } from '@nestjs/common';
import { type IVkApiPort } from '@modules/vk/interfaces';
import { VK_API_SERVICE } from '@modules/vk/constants';

@Injectable()
export class VkMessageService {
  constructor(
    @Inject(VK_API_SERVICE)
    private readonly vkApi: IVkApiPort,
  ) {}

  public async sendMessage(
    userId: string | number,
    message: string,
  ): Promise<void> {
    return this.vkApi.sendMessage(userId, message);
  }
}
