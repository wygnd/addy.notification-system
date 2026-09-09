import { configurePinoLogger } from '@addy/common';
import { DatabaseModule } from '@modules/database/module';
import { HealthModule } from '@modules/health/module';
import { IdentityModule } from '@modules/identity/module';
import { NotificationModule } from '@modules/notifications/module';
import { RedisModule } from '@modules/redis/module';
import { UsersModule } from '@modules/users/module';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { IS_PRODUCTION } from '@shared/constants';
import { TransformErrorFilter } from '@shared/filters';
import { AuthGuard } from '@shared/guards';
import { TransformSuccessResponseInterceptor } from '@shared/interceptors';
import { RpcExceptionInterceptor } from '@shared/interceptors/exception';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'node:path';

@Module({
  imports: [
    LoggerModule.forRoot(configurePinoLogger(IS_PRODUCTION, 'GATEWAY')),
    ConfigModule.forRoot({}),
    CqrsModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api/'],
      serveStaticOptions: {
        cacheControl: true,
      },
      serveRoot: '/',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 50 }],
    }),

    HealthModule,
    DatabaseModule,
    NotificationModule,
    VkModule,
    IdentityModule,
    RedisModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RpcExceptionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformSuccessResponseInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: TransformErrorFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
