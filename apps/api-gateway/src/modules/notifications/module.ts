import { Module } from '@nestjs/common';
import { NotificationControllerV1 } from '@modules/notifications/controllers/controller';
import { NotificationService } from '@modules/notifications/services/service';

@Module({
  imports: [],
  controllers: [NotificationControllerV1],
  providers: [NotificationService],
})
export class NotificationModule {}
