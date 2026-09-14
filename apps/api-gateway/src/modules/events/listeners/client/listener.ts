import { AddyApiService } from '@modules/addy/services';
import { EventClientConnected } from '@modules/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEnum } from '@shared/enums';

@Injectable()
export class EventClientListener {
  constructor(private readonly addyService: AddyApiService) {}

  @OnEvent(EventEnum.CLIENT_CONNECTED, { async: true })
  public async handleClientConnectedEvent(event: EventClientConnected) {
    await this.addyService.sendNotificationSetPlatform({
      platform: event.platform,
      user_id: event.userId,
    });
  }
}
