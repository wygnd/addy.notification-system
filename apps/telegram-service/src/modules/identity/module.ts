import { IDENTITY_SERVICE } from '@modules/identity/constants';
import { identityProviders } from '@modules/identity/providers';
import { IdentityService } from '@modules/identity/services/service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';









@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync({
      clients: [
        {
          name: IDENTITY_SERVICE,
          useFactory: (configService: ConfigService) => ({
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
                  'x-dead-letter-exchange': 'notifications.dlx', // куда падают сообщения, которые не смогли обработать/протухли
                  'x-dead-letter-routing-key': 'failed-notifications',
                  'x-max-priority': 10, // включает приоритеты сообщений (0-10)
                },
              },
              prefetchCount: 10, // Кол-во одновременных обработок сообщений брокером
            },
          }),
          inject: [ConfigService],
          imports: [ConfigModule],
        },
      ],
    }),
  ],
  providers: identityProviders,
  exports: [IdentityService],
})
export class IdentityModule {}
