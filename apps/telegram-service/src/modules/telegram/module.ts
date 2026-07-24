import { IdentityModule } from '@modules/identity/module';
import { TelegramHttpControllerV1 } from '@modules/telegram/controllers';
import { TelegramProviders } from '@modules/telegram/providers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, IdentityModule],
  controllers: [TelegramHttpControllerV1],
  providers: TelegramProviders,
})
export class TelegramModule {}
