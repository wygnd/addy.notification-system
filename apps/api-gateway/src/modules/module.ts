import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '@modules/notifications/module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformSuccessResponseInterceptor } from '@shared/interceptors';
import { HealthModule } from '@modules/health/module';
import { VkModule } from '@modules/vk/module';
import { IdentityModule } from '@modules/identity/module';
import { DatabaseModule } from '@modules/database/module';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@modules/redis/module';
import { UsersModule } from '@modules/users/module';

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
      useClass: TransformSuccessResponseInterceptor,
    },
  ],
})
export class AppModule {}
