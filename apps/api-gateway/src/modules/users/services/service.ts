import { AppException, ErrorCodeEnum } from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { EventClientConnected } from '@modules/events/events';
import { IdentityService } from '@modules/identity/services/service';
import { TelegramService } from '@modules/telegram/services/service';
import { UserDisconnectQueryRequestDTO } from '@modules/users/dtos';
import { UserDisconnectResponseDto } from '@modules/users/dtos/[id]/disconnect/response/dto';
import {
  IUserConnectFields,
  IUserUpdateFields,
} from '@modules/users/interfaces';
import { VkService } from '@modules/vk/services/service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEnum } from '@shared/enums';
import { IPlatformMessenger } from '@shared/interfaces';

@Injectable()
export class UserService {
  private readonly messengers: Record<PlatformEnum, IPlatformMessenger | null>;

  constructor(
    private readonly vkService: VkService,
    private readonly telegramService: TelegramService,
    private readonly identityService: IdentityService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.messengers = {
      [PlatformEnum.VK]: this.vkService,
      [PlatformEnum.TELEGRAM]: this.telegramService,
      [PlatformEnum.MAX]: null,
      [PlatformEnum.UNKNOWN]: null,
    };
  }

  public async connectUser(request: IUserConnectFields) {
    const { userId: userIdString, platform } = request;
    const userId = Number(userIdString);

    const messenger = this.messengers[platform];

    if (!messenger) {
      throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
    }

    const result = await messenger.connect(request);

    const clientConnections = await this.identityService.getClientConnections({
      userId: userId,
    });

    // Формируем кол-во подключенных аккаунтов
    const clientConnectionCount = clientConnections.items.reduce((acc, c) => {
      if (c.connected) {
        acc += 1;
      }
      return acc;
    }, 0);

    // Если это первый аккаунт, отправляем событие в ADDY
    if (clientConnectionCount <= 1) {
      this.eventEmitter.emit(
        EventEnum.CLIENT_CONNECTED,
        new EventClientConnected(userId, platform),
      );
    }

    return {
      message: result.message,
      code: result.code,
      connection_link: result.connectionLink,
    };
  }

  public async getUserBuId(userId: number) {
    if (!userId) {
      throw new AppException(ErrorCodeEnum.USER_NOT_FOUND);
    }

    return this.identityService.getClientConnections({ userId });
  }

  public async disconnectUser(
    userId: number,
    fields: UserDisconnectQueryRequestDTO,
  ): Promise<UserDisconnectResponseDto> {
    const response = await this.identityService.disconnectClient({
      userId: userId.toString(),
      platform: fields.platform,
    });

    if (!response.ok) {
      throw new AppException(ErrorCodeEnum.USER_INVALID_DISCONNECT);
    }

    return {
      user_id: userId,
      message: 'Пользователь успешно отключен',
    };
  }

  public async updateUser(request: IUserUpdateFields) {
    if (Object.keys(request.fields).length === 0) {
      return false;
    }

    const result = await this.identityService.updateClient({
      userId: request.userId,
      platform: request.platform,
      fields: request.fields,
    });

    return result.ok;
  }
}
