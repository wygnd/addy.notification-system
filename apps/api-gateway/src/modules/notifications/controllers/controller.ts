import { Controller, Post } from '@nestjs/common';
import { NotificationService } from '@modules/notifications/services/service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationControllerV1 {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Отправка уведомления' })
  @Post()
  public async receiveNotification() {
    return this.notificationService.receiveNotification();
  }
}
