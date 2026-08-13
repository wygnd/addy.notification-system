import {
  IVkEventEmitMap,
  IVkSendMessageMap,
  IVkSendMessageResponseMap,
  VkEmitPatternEnum,
  VkSendPatternEnum,
} from '@addy/common';
import { VkProvider } from '@modules/vk/providers/provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VkService {
  constructor(private readonly vkProvider: VkProvider) {}

  /**
   * Отправляет событие в VK Service
   */
  private async emit<T extends VkEmitPatternEnum = VkEmitPatternEnum>(
    pattern: T,
    data: IVkEventEmitMap[T],
  ): Promise<void> {
    return this.vkProvider.emit(pattern, data);
  }

  private async send<T, U extends VkSendPatternEnum = VkSendPatternEnum>(
    pattern: U,
    data: IVkSendMessageMap[U],
  ): Promise<IVkSendMessageResponseMap[U]> {
    return this.vkProvider.send(pattern, data);
  }

  public async sendMessage(
    data: IVkEventEmitMap[VkEmitPatternEnum.SEND_MESSAGE],
  ): Promise<void> {
    await this.vkProvider.emit(VkEmitPatternEnum.SEND_MESSAGE, data);
  }

  public async clientInGroup(
    data: IVkSendMessageMap[VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP],
  ) {
    return this.send(VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP, data);
  }

  public async sendMessageBatch(
    data: IVkEventEmitMap[VkEmitPatternEnum.SEND_MESSAGE_BATCH],
  ): Promise<void> {
    return this.emit(VkEmitPatternEnum.SEND_MESSAGE_BATCH, data);
  }
}
