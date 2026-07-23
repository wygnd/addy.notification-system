import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramProviders } from '@modules/telegram/providers';

@Module({
  imports: [ConfigModule],
  providers: TelegramProviders,
})
export class TelegramModule {}
