import { PlatformEnum } from '@src/enums';
import { IIdentityUpdateEntity } from '@src/interfaces';

export interface IIdentityMessageClientUpdatePayload extends Pick<
  IIdentityUpdateEntity,
  'fields'
> {
  userId: number;
  platform: PlatformEnum;
}

export interface IIdentityMessageClientUpdateResponse {
  ok: boolean;
}
