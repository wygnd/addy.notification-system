import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IDENTITY_RABBITMQ_SERVICE } from '@modules/identity/constants/constants';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { IdentityPatternEnum } from '@modules/identity/enums';
import {
  IIdentityMessageMap,
  IIdentityMessageResponseMap,
} from '@modules/identity/interfaces';

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

  public async emit<T extends IdentityPatternEnum>(
    pattern: T,
    data: IIdentityMessageMap[T],
  ): Promise<void> {
    await firstValueFrom(this.client.emit(pattern, data));
  }

  public async send<T extends IdentityPatternEnum>(
    pattern: T,
    data: IIdentityMessageMap[T],
  ): Promise<IIdentityMessageResponseMap[T]> {
    return firstValueFrom(
      this.client.send<IIdentityMessageResponseMap[T]>(pattern, data).pipe(
        timeout(10_000),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }
}
