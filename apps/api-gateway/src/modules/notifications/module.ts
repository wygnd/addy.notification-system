import { IdentityModule } from '@modules/identity/module';
import {
  NotificationControllerV1,
  NotificationRMQController,
} from '@modules/notifications/controllers';
import { NotificationLogModel } from '@modules/notifications/models';
import { notificationProviders } from '@modules/notifications/providers';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([NotificationLogModel]),
    VkModule,
    IdentityModule,
  ],
  controllers: [NotificationControllerV1, NotificationRMQController],
  providers: [...notificationProviders],
})
export class NotificationModule {}
