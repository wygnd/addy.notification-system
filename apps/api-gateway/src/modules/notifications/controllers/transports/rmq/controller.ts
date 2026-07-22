import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { NotificationResultService } from '@modules/notifications/services';
import { NotificationResultEnum } from '@modules/notifications/enums';
import { INotificationResultMap } from '@modules/notifications/interfaces';
import { normalizeError } from '@shared/utils/errors';

@Controller()
export class NotificationRMQController {
  private readonly logger = new Logger(NotificationRMQController.name);

  constructor(
    private readonly notificationResultService: NotificationResultService,
  ) {}

  @MessagePattern(NotificationResultEnum.SEND_RESULT)
  public async receiveNotificationResult(
    @Payload() data: INotificationResultMap[NotificationResultEnum.SEND_RESULT],
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMessage = context.getMessage() as Message;

    try {
      await this.notificationResultService.receiveNotificationResult(data);

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(normalizeError(error));
      channel.nack(originalMessage, false, false);
    }
  }
}
