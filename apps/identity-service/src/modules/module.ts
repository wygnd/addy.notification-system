import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './identity/module';
import { DatabaseModule } from './database/module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, IdentityModule],
})
export class AppModule {}
