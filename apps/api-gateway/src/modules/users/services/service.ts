import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';
import {
  IUserBlock,
  IUserCode,
  IUserConnectFields,
} from '@modules/users/interfaces';
import { PlatformEnum } from '@shared/interfaces';
import { VkService } from '@modules/vk/services/service';
import { normalizeError } from '@shared/utils/errors';
import { VkSendPatternEnum } from '@modules/vk/enums';
import { IUserConnectResponse } from '@modules/users/interfaces/connect/response';
import { IVkSendMessageResponseMap } from '@modules/vk/interfaces';
import { IdentityService } from '@modules/identity/services/service';
import { RedisService } from '@modules/redis/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';

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
    try {
      const { userId, platform } = request;
      const keyTail = `${platform}:${userId}`,
        redisKeyUserBlock = REDIS_KEYS.OTP_BLOCK + keyTail,
        redisKeyUserCode = REDIS_KEYS.OTP_CODE + keyTail;
      let response: IUserConnectResponse | null = null;
      const [userWasBlocked, userAttempts] = await Promise.all([
        this.redisService.get<IUserBlock>(redisKeyUserBlock),
        this.redisService.get<IUserCode>(redisKeyUserCode),
      ]);

      if (userWasBlocked) {
        throw new MethodNotAllowedException(
          'User was blocked on 15 minutes.' +
            `Next attempts is available on ${new Date(userWasBlocked.blockedAt + 15 * 60 * 60)}`,
        );
      }

      if (userAttempts && userAttempts.attempts > 3) {
        this.redisService.set<IUserBlock>(
          redisKeyUserBlock,
          {
            blockedAt: Date.now(),
            reason: 'max_attempts',
          },
          15 * 60,
        );

        throw new MethodNotAllowedException(
          'User was blocked on 15 minutes' +
            `Next attempt is available on ${new Date(Date.now() + 15 * 60 * 60)}`,
        );
      }

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

      if (!response && platform === PlatformEnum.VK) {
        return {
          message: `Клиент подключен к ${platform}`,
        };
      }

      if (!response || !response.code) {
        throw new InternalServerErrorException(
          `Не удалось создать код для подключения ${platform}`,
        );
      }

      let newUserAttempts: IUserCode;

      if (userAttempts) {
        newUserAttempts = {
          code: response.code.toString(),
          attempts: userAttempts.attempts + 1,
          createdAt: userAttempts.createdAt,
        };
      } else {
        newUserAttempts = {
          code: response.code.toString(),
          attempts: 0,
          createdAt: Date.now(),
        };
      }

      this.redisService.set(redisKeyUserCode, newUserAttempts, 5 * 60);

      return {
        code: response.code,
        message: 'Код сгенерирован',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(normalizeError(error));
      throw new InternalServerErrorException(
        'Произошла непредвиденная ошибка на сервере',
      );
    }
  }

  private async connectUserToVK(userId: string, vkUserId: string) {
    const response = await this.vkService.sendMessage<
      IVkSendMessageResponseMap[VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]
    >(VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP, {
      userId: userId,
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
