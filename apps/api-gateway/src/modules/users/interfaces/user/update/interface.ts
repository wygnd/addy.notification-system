import { PlatformEnum } from '@addy/common';
import { UpdateUserRequestDTO } from '@modules/users/dtos';

export interface IUserUpdateFields {
  userId: number;
  platform: PlatformEnum;
  fields: UpdateUserRequestDTO;
}
