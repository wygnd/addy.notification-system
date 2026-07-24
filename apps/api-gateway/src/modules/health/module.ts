import { HealthController } from '@modules/health/controllers/controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
