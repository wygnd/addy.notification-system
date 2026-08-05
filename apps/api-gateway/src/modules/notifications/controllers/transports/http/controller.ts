import { AppException, ErrorCodeEnum } from '@addy/common';
import { NotificationRequestDTO } from '@modules/notifications/dtos';
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

@ApiTags('Notifications')
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
  @ApiBody({
    type: NotificationRequestDTO,
    required: true,
  })
  @ApiOkResponse({
    description: 'Успешный ответ',
    type: NotificationResponseDTO,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  public async receiveNotification(
    @Headers('host') host: string,
    @Headers('X-Request-ID') requestId: string,
    @Body() body: NotificationRequestDTO,
  ): Promise<NotificationResponseDTO> {
    if (!requestId) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'X-Request-ID is required',
      );
    }

    return this.notificationService.receiveNotification({
      ...body,
      requestId: requestId,
      host: host,
    });
  }
}
