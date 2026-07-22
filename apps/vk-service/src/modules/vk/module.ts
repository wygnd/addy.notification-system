import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VkService } from './services/service';
import { VkController } from './controllers/controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_RABBITMQ_SERVICE_RESULT } from '@modules/vk/constants/constants';
import { VkNotificationProvider } from '@modules/vk/providers/provider';

@Module({
  imports: [
    ConfigModule,
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
  controllers: [VkController],
  providers: [VkNotificationProvider, VkService],
})
export class VkModule {}
