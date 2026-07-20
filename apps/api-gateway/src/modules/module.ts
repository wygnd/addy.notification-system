import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '@modules/notifications/module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformSuccessResponseInterceptor } from '@shared/interceptors';

@Module({
  imports: [ConfigModule.forRoot({}), NotificationModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformSuccessResponseInterceptor,
    },
  ],
})
export class AppModule {}
