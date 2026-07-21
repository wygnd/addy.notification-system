import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VkModule } from '@modules/vk/module';

@Module({
  imports: [ConfigModule.forRoot(), VkModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
