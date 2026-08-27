import {
  NotificationDTO,
  NotificationRetryResponseDTO,
} from '@modules/notifications/dtos';
import { NotificationService } from '@modules/notifications/services';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from '@shared/decorators';
import { randomUUID } from 'node:crypto';

@ApiTags('Уведомления')
@ApiParam({
  name: 'notification_id',
  description:
    'ID уведомления. Можно узнать из поля <b>notification_id</b> при отправке сообщения',
  required: true,
  example: randomUUID(),
})
@Controller({
  version: '1',
  path: 'notifications/:notification_id',
})
export class NotificationIdControllerV1 {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Получить информацию о задаче' })
  @ApiSuccessResponse(NotificationDTO, HttpStatus.OK, 'Успешный ответ')
  @Get()
  public async getNotificationStatus(
    @Param('notification_id') notificationId: string,
  ) {
    return this.notificationService.getNotificationById(notificationId);
  }

  @ApiOperation({ summary: 'Повторить отправку уведомления заново' })
  @ApiSuccessResponse(
    NotificationRetryResponseDTO,
    HttpStatus.OK,
    'Успешный ответ',
  )
  @HttpCode(HttpStatus.OK)
  @Post('retry')
  public async retryNotification(
    @Param('notification_id') notificationId: string,
  ) {
    return this.notificationService.retryNotification(notificationId);
  }
}
