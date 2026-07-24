import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';
import { VkProvider } from '@modules/vk/providers/provider';
import { VkService } from '@modules/vk/services/service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: VK_RABBITMQ_SERVICE,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            name: VK_RABBITMQ_SERVICE,
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: configService.getOrThrow<string>('RABBITMQ_QUEUE_NAME_VK'),
              queueOptions: {
                durable: true,
                autoDelete: false,
                arguments: {
                  'x-dead-letter-exchange': 'notifications.dlx', // куда падают сообщения, которые не смогли обработать/протухли
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
  providers: [VkProvider, VkService],
  exports: [VkService],
})
export class VkModule {}
