import { Module } from '@nestjs/common';
import {
  NotificationControllerV1,
  NotificationRMQController,
} from '@modules/notifications/controllers';
import { VkModule } from '@modules/vk/module';
import { SequelizeModule } from '@nestjs/sequelize';
import { notificationProviders } from '@modules/notifications/providers';
import { NotificationLogModel } from '@modules/notifications/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationLogModel]), VkModule],
  controllers: [NotificationControllerV1, NotificationRMQController],
  providers: [...notificationProviders],
})
export class NotificationModule {}
