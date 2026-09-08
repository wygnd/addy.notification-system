import { HealthController } from '@modules/health/controllers/controller';
import { HealthService } from '@modules/health/services';
import { IdentityModule } from '@modules/identity/module';
import { TelegramModule } from '@modules/telegram/module';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';

@Module({
  imports: [IdentityModule, VkModule, TelegramModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
