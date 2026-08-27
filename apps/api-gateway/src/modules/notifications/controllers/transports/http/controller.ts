import {
  NotificationBatchResponseDTO,
  NotificationRequestDTO,
} from '@modules/notifications/dtos';
import { NotificationBatchRequestDTO } from '@modules/notifications/dtos/request/batch/dto';
import { NotificationResponseDTO } from '@modules/notifications/dtos/response/dto';
import { NotificationService } from '@modules/notifications/services/service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@shared/decorators';
import { type FastifyReply } from 'fastify';

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
  @ApiSuccessResponse(
    NotificationResponseDTO,
    HttpStatus.ACCEPTED,
    'Успешный ответ',
  )
  @ApiBody({
    type: NotificationRequestDTO,
    required: true,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  public async receiveNotification(
    @Body() body: NotificationRequestDTO,
    @Req() request: FastifyReply,
  ): Promise<NotificationResponseDTO> {
    return this.notificationService.receiveNotification({
      requestId: body.notification_id,
      host: request.headers['host'],
      userId: body.user_id,
      payload: body.payload,
      platform: body.platform,
    });
  }

  @ApiOperation({ summary: 'Отправка нескольких уведомлений за раз' })
  @ApiSuccessResponse(
    NotificationBatchResponseDTO,
    HttpStatus.OK,
    'Успешный ответ',
  )
  @HttpCode(HttpStatus.OK)
  @Post('batch')
  public async receiveBatchNotification(
    @Body() body: NotificationBatchRequestDTO,
    @Req() request: FastifyReply,
  ) {
    return this.notificationService.receiveBatchNotification({
      requestId: body.notification_id,
      host: request.headers['host'],
      defaultPayload: body.default_payload,
      recipients: body.recipients.map((r) => ({
        ...r,
        userId: r.user_id.toString(),
      })),
    });
  }
}
