import { UserConnectRequestDTO } from '@modules/users/dtos';
import { IUserConnectFields } from '@modules/users/interfaces';
import { PlatformEnum } from '@shared/interfaces';

export class UserMapper {
  public static toDomainModel(dto: UserConnectRequestDTO): IUserConnectFields {
    if (dto.platform === PlatformEnum.VK) {
      return {
        platform: dto.platform,
        userId: dto.user_id,
        platformUserId: dto.platform_user_id!,
      };
    }

    return { platform: dto.platform, userId: dto.user_id };
  }
}
