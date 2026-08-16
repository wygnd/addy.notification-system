import { IUserConnectFields, IUserConnectResponse } from '@modules/users/interfaces';

export interface IPlatformSendMessagePayload {
  userId: string;
  text: string;
  correlationId: string;
}

export interface IPlatformMessenger {
  sendMessage(data: IPlatformSendMessagePayload): Promise<void>;
  connect(data: IUserConnectFields): Promise<IUserConnectResponse>;
}
