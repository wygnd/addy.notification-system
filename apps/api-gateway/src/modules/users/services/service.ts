import {
  IIdentityMessageSendConnectResponse,
  IVkSendMessageResponseMap,
  VkSendPatternEnum,
} from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import {
  IUserBlock,
  IUserCode,
  IUserConnectFields,
} from '@modules/users/interfaces';
import { IUserConnectResponse } from '@modules/users/interfaces/connect/response';
import { VkService } from '@modules/vk/services/service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly vkService: VkService,
    private readonly identityService: IdentityService,
    private readonly redisService: RedisService,
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
      case PlatformEnum.MAX:
        response = await this.identityService.connectClient(request);
        break;

      default:
        throw new MethodNotAllowedException();
    }

    if (!response || response.platform === PlatformEnum.UNKNOWN) {
      throw new InternalServerErrorException(
        `Invalid create code for ${platform}`,
      );
    }

    if (!response.status) {
      throw new BadRequestException(response.message);
    }

    if (response.platform === PlatformEnum.VK) {
      return {
        message: `Client was successfully connected to ${platform}`,
      };
    }

    if (response.platform === PlatformEnum.MAX) {
      throw new MethodNotAllowedException();
    }

    return {
      code: response.code,
      message: 'Code was successfully generated',
    };
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
