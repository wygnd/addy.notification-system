import { AppException, ErrorCodeEnum } from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { TelegramService } from '@modules/telegram/services/service';
import { IUserConnectFields } from '@modules/users/interfaces';
import { VkService } from '@modules/vk/services/service';
import { Injectable } from '@nestjs/common';
import { IPlatformMessenger } from '@shared/interfaces';

@Injectable()
export class UserService {
  private readonly messengers: Record<PlatformEnum, IPlatformMessenger | null>;

  constructor(
    private readonly vkService: VkService,
    private readonly telegramService: TelegramService,
    private readonly identityService: IdentityService,
  ) {
    this.messengers = {
      [PlatformEnum.VK]: this.vkService,
      [PlatformEnum.TELEGRAM]: this.telegramService,
      [PlatformEnum.MAX]: null,
      [PlatformEnum.UNKNOWN]: null,
    };
  }

  public async connectUser(request: IUserConnectFields) {
    const { platform } = request;

    const messenger = this.messengers[platform];

    if (!messenger) {
      throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
    }

    const { code, connectionLink } = await messenger.connect(request);

    return { code, connection_link: connectionLink };
  }

  public async getUserByID(userId: string) {
    if (!userId) {
      throw new AppException(ErrorCodeEnum.USER_NOT_FOUND);
    }

    return this.identityService.getClientConnections({ userId });
  }
}
