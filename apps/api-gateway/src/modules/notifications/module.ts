import { IdentityModule } from '@modules/identity/module';
import {
  NotificationControllerV1,
  NotificationIdControllerV1,
  NotificationRMQController,
} from '@modules/notifications/controllers';
import { NotificationLogModel } from '@modules/notifications/models';
import { notificationProviders } from '@modules/notifications/providers';
import { RedisModule } from '@modules/redis/module';
import { TelegramModule } from '@modules/telegram/module';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([NotificationLogModel]),
    IdentityModule,
    VkModule,
    TelegramModule,
    RedisModule,
  ],
  controllers: [
    NotificationControllerV1,
    NotificationIdControllerV1,
    NotificationRMQController,
  ],
  providers: [...notificationProviders],
})
export class NotificationModule {}
