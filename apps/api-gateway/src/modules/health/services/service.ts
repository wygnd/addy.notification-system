import { IdentityService } from '@modules/identity/services/service';
import { TelegramService } from '@modules/telegram/services/service';
import { VkService } from '@modules/vk/services/service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor(
    private readonly identityService: IdentityService,
    private readonly vkService: VkService,
    private readonly telegramService: TelegramService,
  ) {}

  public async health() {
    return {
      gateway: true,
      identity_service: await this.identityService.health(),
      vk_service: await this.vkService.health(),
      telegram_service: await this.telegramService.health(),
    };
  }
}
