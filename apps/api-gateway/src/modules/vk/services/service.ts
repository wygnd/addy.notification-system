import {
  AppException,
  ErrorCodeEnum,
  IVkSendMessageMap,
  PlatformEnum,
  VkCheckClientInGroupResponse,
  VkEmitPatternEnum,
  VkSendPatternEnum,
} from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import {
  IUserConnectFields,
  IUserConnectResponse,
} from '@modules/users/interfaces';
import { VkProvider } from '@modules/vk/providers/provider';
import { Injectable } from '@nestjs/common';
import {
  IPlatformMessenger,
  IPlatformSendMessagePayload,
} from '@shared/interfaces';

@Injectable()
export class VkService implements IPlatformMessenger {
  constructor(
    private readonly vkProvider: VkProvider,
    private readonly identityService: IdentityService,
  ) {}

  /**
   * Отправляет сообщение в сервис
   */
  public async sendMessage(data: IPlatformSendMessagePayload): Promise<void> {
    await this.vkProvider.emit(VkEmitPatternEnum.SEND_MESSAGE, {
      userId: data.userId,
      correlationId: data.correlationId,
      text: data.text,
    });
  }

  /**
   * Подключает пользователя
   */
  public async connect(
    data: IUserConnectFields,
  ): Promise<IUserConnectResponse> {
    if (data.platform !== PlatformEnum.VK) {
      throw new AppException(
        ErrorCodeEnum.NOT_ALLOWED,
        'Invalid platform for VK messenger',
      );
    }

    const response = await this.isMemberClient({
      userId: data.platformUserId,
    });

    if (!response.status) {
      throw new AppException(
        ErrorCodeEnum.SERVICE_BAD_REQUEST,
        response.message,
      );
    }

    return this.identityService.connectClient({
      platform: PlatformEnum.VK,
      userId: data.userId.toString(), // todo
      platformUserId: data.platformUserId,
    });
  }

  /**
   * Проверяет, состоит ли клиент в группе
   * @param data
   */
  public async isMemberClient(
    data: IVkSendMessageMap[VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP],
  ): Promise<VkCheckClientInGroupResponse> {
    return this.vkProvider.send(
      VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP,
      data,
    );
  }
}
