import { NotificationRequestDTO } from '@modules/notifications/dtos';
import { NotificationBatchRequestDTO } from '@modules/notifications/dtos/request/batch/dto';
import { NotificationResponseDTO } from '@modules/notifications/dtos/response/dto';
import { NotificationService } from '@modules/notifications/services/service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

@ApiTags('Уведомления')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationControllerV1 {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Отправка уведомления',
    description: 'Добавляет отправку сообщения в очередь',
  })
  @ApiBody({
    type: NotificationRequestDTO,
    required: true,
  })
  @ApiHeader({
    name: 'host',
    description:
      'Адрес хоста, с которого отправляется запрос. Заполняется автоматически',
    required: false,
  })
  @ApiHeader({
    name: 'X-Request-ID',
    description: 'Уникальный идентификатор запроса',
    required: true,
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Успешный ответ',
    type: NotificationResponseDTO,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  public async receiveNotification(
    @Headers('host') host: string,
    @Body() body: NotificationRequestDTO,
  ): Promise<NotificationResponseDTO> {
    return this.notificationService.receiveNotification({
      requestId: body.notification_id,
      host: host,
      userId: body.user_id,
      payload: body.payload,
      platform: body.platform,
    });
  }

  @ApiOperation({ summary: 'Отправка нескольких уведомлений за раз' })
  @ApiHeader({
    name: 'host',
    description:
      'Адрес хоста, с которого отправляется запрос. Заполняется автоматически',
    required: false,
  })
  @ApiHeader({
    name: 'X-Request-ID',
    description: 'Уникальный идентификатор запроса',
    required: true,
    example: randomUUID(),
  })
  @HttpCode(HttpStatus.OK)
  @Post('batch')
  public async receiveBatchNotification(
    @Headers('host') host: string,
    @Headers('X-Request-ID') requestId: string,
    @Body() body: NotificationBatchRequestDTO,
  ) {
    return this.notificationService.receiveBatchNotification({
      ...body,
      host,
      requestId,
    });
  }
}
