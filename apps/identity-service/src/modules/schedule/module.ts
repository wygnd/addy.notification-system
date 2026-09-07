import { IdentityModule } from '@modules/identity/module';
import { Module } from '@nestjs/common';
import { ScheduleModule as NScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NScheduleModule.forRoot(), IdentityModule],
})
export class ScheduleModule {}
