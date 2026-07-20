import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VK_RABBITMQ_SERVICE } from '@modules/vk/constants/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: VK_RABBITMQ_SERVICE,
          useFactory: (configService: ConfigService) => ({
            name: VK_RABBITMQ_SERVICE,
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: configService.getOrThrow<string>('RABBITMQ_QUEUE_NAME'),
              queueOptions: { durable: false },
            },
          }),
          imports: [ConfigModule],
        },
      ],
    }),
  ],
})
export class VkModule {}
