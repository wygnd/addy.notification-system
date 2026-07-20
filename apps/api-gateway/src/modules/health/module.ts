import { Module } from '@nestjs/common';
import { HealthController } from '@modules/health/controllers/controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
