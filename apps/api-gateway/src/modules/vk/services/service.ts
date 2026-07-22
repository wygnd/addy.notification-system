import { Injectable } from '@nestjs/common';
import { VkProvider } from '@modules/vk/providers/provider';
import { VkPatternEnum } from '@modules/vk/enums';
import { IVkEventEmitMap } from '@modules/vk/interfaces';

@Injectable()
export class VkService {
  constructor(private readonly vkProvider: VkProvider) {}

  /**
   * Отправляет событие в VK Service
   */
  public async emitEvent<T extends VkPatternEnum>(
    pattern: T,
    data: IVkEventEmitMap[T],
  ): Promise<void> {
    return this.vkProvider.emit(pattern, data);
  }
}
