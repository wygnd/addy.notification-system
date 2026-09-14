import { AddyApiProvider } from '@modules/addy/providers';
import { AddyApiService } from '@modules/addy/services';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AddyApiProvider, AddyApiService],
  exports: [AddyApiService],
})
export class AddyModule {}
