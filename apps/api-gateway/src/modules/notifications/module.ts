import { Module } from '@nestjs/common';
import { NotificationControllerV1 } from '@modules/notifications/controllers/controller';
import { VkModule } from '@modules/vk/module';
import { SequelizeModule } from '@nestjs/sequelize';
import { notificationProviders } from '@modules/notifications/providers';
import { NotificationLogModel } from '@modules/notifications/models';

@Module({
  imports: [SequelizeModule.forFeature([NotificationLogModel]), VkModule],
  controllers: [NotificationControllerV1],
  providers: [...notificationProviders],
})
export class NotificationModule {}
