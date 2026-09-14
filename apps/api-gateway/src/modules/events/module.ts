import { AddyModule } from '@modules/addy/module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventClientListener } from '@modules/events/listeners/client/listener';

@Module({
  imports: [EventEmitterModule.forRoot({}), AddyModule],
  providers: [EventClientListener]
})
export class EventModule {}
