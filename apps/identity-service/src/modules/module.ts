import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './identity/module';
import { DatabaseModule } from './database/module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    DatabaseModule,
    IdentityModule,
  ],
})
export class AppModule {}
