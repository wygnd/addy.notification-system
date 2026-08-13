import { VK_API_SERVICE } from '@modules/vk/constants';
import { type IVkApiPort } from '@modules/vk/interfaces';
import { Inject, Injectable } from '@nestjs/common';

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

  public async sendMessageBatch(
    userIds: (string | number)[],
    message: string,
  ): Promise<void> {
    return this.vkApi.execute('messages.send', {
      user_ids: userIds.join(','),
      message: message,
    });
  }
}
