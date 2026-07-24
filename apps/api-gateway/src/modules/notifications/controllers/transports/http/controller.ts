import { NotificationRequestDTO } from '@modules/notifications/dtos';
import { NotificationService } from '@modules/notifications/services/service';
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationControllerV1 {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Отправка уведомления' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  public async receiveNotification(
    @Headers('host') host: string,
    @Headers('X-Request-ID') requestId: string,
    @Body() body: NotificationRequestDTO,
  ) {
    if (!requestId) {
      throw new BadRequestException('X-Request-ID is required');
    }

    return this.notificationService.receiveNotification({
      ...body,
      requestId: requestId,
      host: host,
    });
  }
}
