import { TelegramModule } from '@modules/telegram/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TelegramModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
