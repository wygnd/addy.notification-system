import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDENTITY_RABBITMQ_SERVICE } from '@modules/identity/constants/constants';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { IdentityService } from '@modules/identity/services/service';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: IDENTITY_RABBITMQ_SERVICE,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            name: IDENTITY_RABBITMQ_SERVICE,
            transport: Transport.RMQ,
            options: {
              urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
              queue: configService.getOrThrow<string>(
                'RABBITMQ_QUEUE_NAME_IDENTITY',
              ),
              queueOptions: {
                durable: true,
                autoDelete: false,
                arguments: {
                  'x-message-ttl': 60000, // сообщение живёт максимум 60с, потом дропается или уходит в DLX
                  'x-dead-letter-exchange': 'notifications.dlx', // куда падают сообщения, которые не смогли обработать/протухли
                  'x-dead-letter-routing-key': 'failed-notifications',
                  'x-max-priority': 10, // включает приоритеты сообщений (0-10)
                },
              },
            },
          }),
          imports: [ConfigModule],
        },
      ],
    }),
  ],
  providers: [IdentityProvider, IdentityService],
})
export class IdentityModule {}
