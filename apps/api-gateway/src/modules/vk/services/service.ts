import { Injectable } from '@nestjs/common';
import { VkProvider } from '@modules/vk/providers/service';

@Injectable()
export class VkService {
  constructor(private readonly vkProvider: VkProvider) {}
}
