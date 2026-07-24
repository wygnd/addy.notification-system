import {
  IdentitySendPatternEnum,
  IIdentitySendMessageMap,
  IIdentitySendMessageResponseMap,
} from '@addy/common';
import { IDENTITY_SERVICE } from '@modules/identity/constants/constants';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class IdentityProvider implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(IDENTITY_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  public async emit<T extends IdentitySendPatternEnum>(
    pattern: T,
    data: IIdentitySendMessageMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }

  public async send<T extends IdentitySendPatternEnum>(
    pattern: T,
    data: IIdentitySendMessageMap[T],
  ): Promise<IIdentitySendMessageResponseMap[T]> {
    return firstValueFrom(
      this.client.send<IIdentitySendMessageResponseMap[T]>(pattern, data).pipe(
        timeout(10_000),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
