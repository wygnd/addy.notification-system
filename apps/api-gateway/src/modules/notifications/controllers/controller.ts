import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '@modules/notifications/services/service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationRequestDTO } from '@modules/notifications/dtos';

@ApiTags('Notifications')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationControllerV1 {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Отправка уведомления' })
  @Post()
  public async receiveNotification(@Body() body: NotificationRequestDTO) {
    return this.notificationService.receiveNotification(body);
  }
}
