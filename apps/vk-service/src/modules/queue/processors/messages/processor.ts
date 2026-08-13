import { QUEUE_MESSAGES_NAME } from '@modules/queue/constants';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(QUEUE_MESSAGES_NAME, { concurrency: 50 })
export class QueueMessageProcessor extends WorkerHost {
  constructor() {
    super();
  }

  public async process(job: Job) {}

  /* ==================== EVENTS LISTENERS ==================== */
  @OnWorkerEvent('completed')
  public async onCompletedEvent(job: Job) {
    // todo
  }

  @OnWorkerEvent('failed')
  public async onFailedEvent(job: Job) {
    // todo
  }

  @OnWorkerEvent('failed')
  public async onErrorEvent(job: Job) {}
}
