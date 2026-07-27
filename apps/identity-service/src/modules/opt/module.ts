import { OtpService } from '@modules/opt/services/service';
import { RedisModule } from '@modules/redis/module';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
