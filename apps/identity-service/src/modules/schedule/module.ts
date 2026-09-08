import { IdentityModule } from '@modules/identity/module';
import { scheduleProviders } from '@modules/schedule/providers';
import { Module } from '@nestjs/common';
import { ScheduleModule as NScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NScheduleModule.forRoot(), IdentityModule],
  providers: scheduleProviders,
})
export class ScheduleModule {}
