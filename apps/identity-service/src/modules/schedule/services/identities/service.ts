import {
  IS_SCHEDULE_ENABLED,
  SCHEDULE_TIME_ZONE,
} from '@modules/schedule/constants';
import { LogCronJob } from '@modules/schedule/decorators';
import { ScheduleIdentityHandler } from '@modules/schedule/handlers';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleIdentityService {
  constructor(private readonly handler: ScheduleIdentityHandler) {}

  @Cron('0 10 * * * *', {
    name: 'clearPendingConnections',
    timeZone: SCHEDULE_TIME_ZONE,
    disabled: IS_SCHEDULE_ENABLED,
  })
  @LogCronJob()
  public async clearPendingConnections() {
    return this.handler.clearPendingConnections();
  }
}
