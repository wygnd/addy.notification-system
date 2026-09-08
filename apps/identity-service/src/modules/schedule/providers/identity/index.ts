import { ScheduleIdentityHandler } from '@modules/schedule/handlers';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsToRpcFilter } from '@shared/exceptions';

export const scheduleIdentityProviders = [
  {
    provide: APP_FILTER,
    useClass: ExceptionsToRpcFilter,
  },

  ScheduleIdentityHandler,
  ScheduleIdentityHandler,
];
