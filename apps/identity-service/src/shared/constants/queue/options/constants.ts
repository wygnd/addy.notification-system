import { DefaultJobOptions } from 'bullmq';

export const QUEUE_DEFAULT_JOB_OPTIONS: DefaultJobOptions = {
  removeOnComplete: false,
  removeOnFail: false,
} as const;
