import { NotificationPatternEnum, NotificationResultEnum } from '@shared/enums';
import { PlatformEnum } from '@shared/interfaces';

interface INotificationSendResultPayload {
  channel: PlatformEnum;
  correlationId: string;
  status: NotificationResultEnum;
}

export interface INotificationEmitMap {
  [NotificationPatternEnum.SEND_RESULT]: INotificationSendResultPayload;
}
