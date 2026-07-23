import { VkApiMethods } from '@modules/vk/interfaces';

export interface IVkApiPort {
  sendMessage(userId: number | string, message: string): Promise<void>;
  execute<T = unknown>(
    method: VkApiMethods,
    params?: Record<string, unknown>,
  ): Promise<T>;
}
