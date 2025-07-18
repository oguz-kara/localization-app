import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TRANSLATION_QUEUE, TranslationJobType } from '../../domain/constants/queue.constants';
import { 
  SyncProjectTranslationsJobData, 
  SyncSingleTranslationJobData 
} from '../../domain/interfaces/translation-job.interface';

@Injectable()
export class TranslationQueueService {
  private readonly logger = new Logger(TranslationQueueService.name);

  constructor(
    @InjectQueue(TRANSLATION_QUEUE) private readonly translationQueue: Queue,
  ) {}

  /**
   * Queue a job to sync all translations for a project
   */
  async queueSyncProjectTranslations(data: SyncProjectTranslationsJobData): Promise<string> {
    this.logger.log(`Queueing sync project translations job for project ${data.projectId}`);
    
    const job = await this.translationQueue.add(
      TranslationJobType.SYNC_PROJECT_TRANSLATIONS,
      data,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 10,
        removeOnFail: false, // Keep failed jobs for inspection
      }
    );

    this.logger.log(`Queued sync project translations job with ID: ${job.id}`);
    return job.id.toString();
  }

  /**
   * Queue a job to sync a single translation
   */
  async queueSyncSingleTranslation(data: SyncSingleTranslationJobData): Promise<string> {
    this.logger.log(`Queueing single translation job for key ${data.translationKeyId}`);
    
    const job = await this.translationQueue.add(
      TranslationJobType.SYNC_SINGLE_TRANSLATION,
      data,
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 50,
        removeOnFail: false, // Keep failed jobs for inspection
      }
    );

    this.logger.log(`Queued single translation job with ID: ${job.id}`);
    return job.id.toString();
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const waiting = await this.translationQueue.getWaiting();
    const active = await this.translationQueue.getActive();
    const completed = await this.translationQueue.getCompleted();
    const failed = await this.translationQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length,
    };
  }

  /**
   * Get failed jobs (dead letter queue)
   */
  async getFailedJobs() {
    const failed = await this.translationQueue.getFailed();
    
    return failed.map(job => ({
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      opts: {
        attempts: job.opts.attempts,
        backoff: job.opts.backoff,
      },
    }));
  }

  /**
   * Retry a failed job
   */
  async retryFailedJob(jobId: string): Promise<void> {
    const job = await this.translationQueue.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    await job.retry();
    this.logger.log(`Retried failed job ${jobId}`);
  }

  /**
   * Clean up completed and failed jobs
   */
  async cleanQueue(grace: number = 24 * 60 * 60 * 1000): Promise<void> {
    // Clean completed jobs older than grace period
    await this.translationQueue.clean(grace, 'completed');
    
    // Clean failed jobs older than grace period (be careful with this)
    await this.translationQueue.clean(grace, 'failed');
    
    this.logger.log(`Cleaned queue jobs older than ${grace}ms`);
  }

  /**
   * Pause the queue
   */
  async pauseQueue(): Promise<void> {
    await this.translationQueue.pause();
    this.logger.log('Translation queue paused');
  }

  /**
   * Resume the queue
   */
  async resumeQueue(): Promise<void> {
    await this.translationQueue.resume();
    this.logger.log('Translation queue resumed');
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string) {
    const job = await this.translationQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress(),
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      opts: job.opts,
    };
  }
}