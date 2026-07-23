import {
  VkApiService,
  VkGroupService,
  VkService,
  VkMessageService,
} from '@modules/vk/services';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import { VK_API_SERVICE } from '@modules/vk/constants';

export const vkProviders = [
  // PROVIDERS
  VkNotificationProvider,
  { provide: VK_API_SERVICE, useClass: VkApiService },

  // SERVICES
  VkService,

  // VK SERVICES
  VkMessageService,
  VkGroupService,
];
