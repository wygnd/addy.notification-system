import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IDENTITY_RABBITMQ_SERVICE } from '@modules/identity/constants/constants';

@Injectable()
export class IdentityProvider implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(IDENTITY_RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
