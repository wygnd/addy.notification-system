import { VK_API_SERVICE } from '@modules/vk/constants';
import { type IVkApiPort } from '@modules/vk/interfaces';
import {
  IGroupGetMembersResponse,
  IVkMessageAllowedResponse,
} from '@modules/vk/interfaces/api/groups';
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

  public async getMemberIds(): Promise<IGroupGetMembersResponse> {
    return this.vkApiService.execute<IGroupGetMembersResponse>(
      'groups.getMembers',
      {
        group_id: this.vkGroupId,
      },
    );
  }

  public async checkUserIdGroup(userId: number): Promise<boolean> {
    const { items: memberIds } = await this.getMemberIds();

    return memberIds.includes(userId);
  }

  public async isAllowSendMessage(userId: number) {
    const { is_allowed } =
      await this.vkApiService.execute<IVkMessageAllowedResponse>(
        'messages.isMessagesFromGroupAllowed',
        {
          group_id: this.vkGroupId,
          user_id: userId,
        },
      );

    return is_allowed !== 0;
  }
}
