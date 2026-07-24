import {
  IVkEventEmitMap,
  IVkSendMessageMap,
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
  public async emitEvent<T extends VkEmitPatternEnum = VkEmitPatternEnum>(
    pattern: T,
    data: IVkEventEmitMap[T],
  ): Promise<void> {
    return this.vkProvider.emit(pattern, data);
  }

  public async sendMessage<T, U extends VkSendPatternEnum = VkSendPatternEnum>(
    pattern: U,
    data: IVkSendMessageMap[U],
  ): Promise<T> {
    return this.vkProvider.send(pattern, data);
  }
}
