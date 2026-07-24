import { VK_API_SERVICE } from '@modules/vk/constants';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import {
  VkApiService,
  VkGroupService,
  VkMessageService,
  VkService,
} from '@modules/vk/services';

export const vkProviders = [
  // PROVIDERS
  VkNotificationProvider,
  { provide: VK_API_SERVICE, useClass: VkApiService },

  // VK SERVICES
  VkMessageService,
  VkGroupService,

  // SERVICES
  VkService,
];
