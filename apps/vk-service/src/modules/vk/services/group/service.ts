import { normalizeError } from '@addy/common';
import { VK_API_SERVICE } from '@modules/vk/constants';
import { type IVkApiPort } from '@modules/vk/interfaces';
import { IVkMessageAllowedResponse } from '@modules/vk/interfaces/api/groups';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VkGroupService {
  private readonly logger = new Logger(VkGroupService.name);
  private readonly vkGroupId: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(VK_API_SERVICE)
    private readonly vkApiService: IVkApiPort,
  ) {
    this.vkGroupId = this.configService.getOrThrow<string>('VK_ADDY_GROUP_ID');
  }

  /**
   * Проверяет, является пользователь участником сообщества
   * @param userId
   */
  public async isMemberUser(userId: number): Promise<boolean> {
    try {
      const isMember = await this.vkApiService.execute<number>(
        'groups.isMember',
        {
          group_id: this.vkGroupId,
          user_id: userId,
        },
      );

      return isMember > 0;
    } catch (error) {
      this.logger.error(normalizeError(error));

      return false;
    }
  }

  /**
   * Проверяет, есть ли доступ к отправке сообщений пользователю от сообщества
   * @param userId
   */
  public async isAllowSendMessage(userId: string | number) {
    try {
      const { is_allowed } =
        await this.vkApiService.execute<IVkMessageAllowedResponse>(
          'messages.isMessagesFromGroupAllowed',
          {
            group_id: this.vkGroupId,
            user_id: userId,
          },
        );

      return { allowed: is_allowed !== 0, userId };
    } catch (error) {
      this.logger.error(normalizeError(error));
      return { allowed: false, userId };
    }
  }
}
