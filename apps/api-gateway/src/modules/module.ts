import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from '@modules/notifications/module';

@Module({
  imports: [ConfigModule.forRoot({}), NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
