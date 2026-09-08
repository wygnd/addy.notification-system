import { configurePinoLogger } from '@addy/common';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_PRODUCTION } from '@shared/constants';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(configurePinoLogger(IS_PRODUCTION, 'VK-SERVICE')),
    VkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
