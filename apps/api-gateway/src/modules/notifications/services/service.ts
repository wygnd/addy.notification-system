import {
  normalizeError,
  NotificationLogStatusEnum,
  VkEmitPatternEnum,
} from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { INotification } from '@modules/notifications/interfaces/request/interface';
import { NotificationLogService } from '@modules/notifications/services/notification-log/service';
import { VkService } from '@modules/vk/services/service';
import {
  ConflictException,
  Injectable,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
    private readonly identityService: IdentityService,
  ) {}

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(fields: INotification) {
    const { userId, platform, requestId, host } = fields;

    const isExists = await this.notificationLogService.exists(requestId);

    if (isExists) {
      throw new ConflictException('Request was handled');
    }

    const { clientId } = await this.identityService.checkClientConnection({
      userId: userId.toString(),
      platform: platform,
    });

    await this.notificationLogService.receiveLog({
      userId: userId.toString(),
      correlationId: requestId,
      channel: platform,
      pattern: `${platform}.message.send`,
      payload: fields,
      status: NotificationLogStatusEnum.RECEIVED,
      source: host || null,
    });

    try {
      switch (fields.platform) {
        case PlatformEnum.VK:
          await this.vkService.emitEvent(VkEmitPatternEnum.SEND_MESSAGE, {
            text: fields.payload.text,
            userId: clientId,
            correlationId: requestId,
          });
          break;

        default:
          throw new MethodNotAllowedException('Invalid platform');
      }

      await this.notificationLogService.markQueued(requestId);

      return {
        message: 'Message was successfully sent',
      };
    } catch (error) {
      const { message } = normalizeError(error);

      await this.notificationLogService.markFailed(requestId, message);

      throw error;
    }
  }
}
