import { DatabaseModule } from '@modules/database/module';
import { HealthModule } from '@modules/health/module';
import { IdentityModule } from '@modules/identity/module';
import { NotificationModule } from '@modules/notifications/module';
import { RedisModule } from '@modules/redis/module';
import { UsersModule } from '@modules/users/module';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TransformSuccessResponseInterceptor } from '@shared/interceptors';
import { RpcExceptionInterceptor } from '@shared/interceptors/exception';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    CqrsModule.forRoot(),

    HealthModule,
    DatabaseModule,
    NotificationModule,
    VkModule,
    IdentityModule,
    RedisModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformSuccessResponseInterceptor,
    },
  ],
})
export class AppModule {}
