import {
  AppException,
  ErrorCodeEnum,
  IIdentityMessageSendConnectResponse,
} from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { IUserConnectFields } from '@modules/users/interfaces';
import { IUserConnectResponse } from '@modules/users/interfaces/connect/response';
import { VkService } from '@modules/vk/services/service';
import {
  BadRequestException,
  Injectable,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly vkService: VkService,
    private readonly identityService: IdentityService,
  ) {}

  public async connectUser(
    request: IUserConnectFields,
  ): Promise<IUserConnectResponse> {
    const { userId, platform } = request;
    let response: IIdentityMessageSendConnectResponse | null = null;

    switch (request.platform) {
      case PlatformEnum.VK:
        await this.connectUserToVK(userId, request.platformUserId);
        break;

      case PlatformEnum.TELEGRAM:
        response = await this.identityService.connectClient(request);
        break;

      default:
        throw new MethodNotAllowedException();
    }

    if (!response) {
      throw new AppException(
        ErrorCodeEnum.INTERNAL_ERROR,
        `Не удалось подключить пользователя к ${platform}`,
      );
    }

    return response;
  }

  private async connectUserToVK(userId: string, vkUserId: string) {
    const response = await this.vkService.clientInGroup({
      userId: vkUserId,
    });

    if (!response.status) {
      throw new BadRequestException(response.message);
    }

    await this.identityService.connectClient({
      platform: PlatformEnum.VK,
      userId: userId,
      platformUserId: vkUserId,
    });
  }
}
