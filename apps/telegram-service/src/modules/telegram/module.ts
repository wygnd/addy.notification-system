import { IdentityModule } from '@modules/identity/module';
import {
  TelegramHttpControllerV1,
  TelegramRMQController,
} from '@modules/telegram/controllers';
import { TelegramProviders } from '@modules/telegram/providers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_RABBITMQ_SERVICE_RESULT } from '@modules/telegram/constants';

@Module({
  imports: [
    ConfigModule,
    IdentityModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_RABBITMQ_SERVICE_RESULT,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            name: NOTIFICATION_RABBITMQ_SERVICE_RESULT,
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: configService.getOrThrow<string>(
                'RABBITMQ_QUEUE_NAME_RESULT',
              ),
              queueOptions: {
                durable: true,
                autoDelete: false,
                arguments: {
                  'x-dead-letter-exchange': 'notifications.result.dlx', // куда падают сообщения, которые не смогли обработать/протухли
                  'x-dead-letter-routing-key': 'failed-notifications',
                  'x-max-priority': 10, // включает приоритеты сообщений (0-10)
                },
              },
              prefetchCount: 10, // Кол-во одновременных обработок сообщений брокером
            },
          }),
          imports: [ConfigModule],
        },
      ],
    }),
  ],
  controllers: [TelegramHttpControllerV1, TelegramRMQController],
  providers: TelegramProviders,
})
export class TelegramModule {}
