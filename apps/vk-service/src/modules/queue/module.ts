import { QUEUE_MESSAGES_NAME } from '@modules/queue/constants/messages/constants';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Register Bull module
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          connection: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<string>('REDIS_PORT'),
            username: configService.getOrThrow<string>('REDIS_USERNAME'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            db: configService.getOrThrow<string>('REDIS_DATABASE'),
          },
        };
      },
      inject: [ConfigService],
    }),

    // Register queues
    BullModule.registerQueue({
      name: QUEUE_MESSAGES_NAME,
      prefix: 'queue:messages',
      defaultJobOptions: {
        removeOnFail: false,
        removeOnComplete: false,
      },
    }),
  ],
})
export class QueueModule {}
