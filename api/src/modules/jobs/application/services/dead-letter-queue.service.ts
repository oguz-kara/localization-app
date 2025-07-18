import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TRANSLATION_QUEUE } from '../../domain/constants/queue.constants';

export interface FailedJobInfo {
  id: string;
  name: string;
  data: any;
  failedReason: string;
  processedOn: number | null;
  finishedOn: number | null;
  attemptsMade: number;
  maxAttempts: number;
  createdAt: Date;
  failedAt: Date;
}

@Injectable()
export class DeadLetterQueueService {
  private readonly logger = new Logger(DeadLetterQueueService.name);

  constructor(
    @InjectQueue(TRANSLATION_QUEUE) private readonly translationQueue: Queue,
  ) {}

  /**
   * Get all failed jobs (dead letter queue)
   */
  async getFailedJobs(): Promise<FailedJobInfo[]> {
    const failedJobs = await this.translationQueue.getFailed();
    
    return failedJobs.map(job => ({
      id: job.id.toString(),
      name: job.name,
      data: job.data,
      failedReason: job.failedReason || 'Unknown error',
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.opts.attempts || 0,
      createdAt: new Date(job.timestamp),
      failedAt: job.finishedOn ? new Date(job.finishedOn) : new Date(),
    }));
  }

  /**
   * Get a specific failed job by ID
   */
  async getFailedJob(jobId: string): Promise<FailedJobInfo | null> {
    const job = await this.translationQueue.getJob(jobId);
    
    if (!job || job.finishedOn === null || job.failedReason === undefined) {
      return null;
    }

    return {
      id: job.id.toString(),
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.opts.attempts || 0,
      createdAt: new Date(job.timestamp),
      failedAt: new Date(job.finishedOn),
    };
  }

  /**
   * Retry a failed job
   */
  async retryFailedJob(jobId: string): Promise<void> {
    const job = await this.translationQueue.getJob(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    if (!job.failedReason) {
      throw new Error(`Job ${jobId} has not failed`);
    }

    await job.retry();
    this.logger.log(`Retried failed job ${jobId}`);
  }

  /**
   * Remove a failed job from the queue permanently
   */
  async removeFailedJob(jobId: string): Promise<void> {
    const job = await this.translationQueue.getJob(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    await job.remove();
    this.logger.log(`Removed failed job ${jobId}`);
  }

  /**
   * Get statistics about failed jobs
   */
  async getFailedJobStats(): Promise<{
    totalFailed: number;
    jobsByType: Record<string, number>;
    jobsByFailureReason: Record<string, number>;
    oldestFailedJob: Date | null;
    newestFailedJob: Date | null;
  }> {
    const failedJobs = await this.getFailedJobs();
    
    const jobsByType: Record<string, number> = {};
    const jobsByFailureReason: Record<string, number> = {};
    
    for (const job of failedJobs) {
      jobsByType[job.name] = (jobsByType[job.name] || 0) + 1;
      
      // Extract main error type from failure reason
      const errorType = this.extractErrorType(job.failedReason);
      jobsByFailureReason[errorType] = (jobsByFailureReason[errorType] || 0) + 1;
    }

    const sortedByDate = failedJobs.sort((a, b) => a.failedAt.getTime() - b.failedAt.getTime());
    
    return {
      totalFailed: failedJobs.length,
      jobsByType,
      jobsByFailureReason,
      oldestFailedJob: sortedByDate[0]?.failedAt || null,
      newestFailedJob: sortedByDate[sortedByDate.length - 1]?.failedAt || null,
    };
  }

  /**
   * Clean up old failed jobs
   */
  async cleanupOldFailedJobs(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const failedJobs = await this.getFailedJobs();
    const jobsToRemove = failedJobs.filter(job => job.failedAt < cutoffDate);
    
    let removedCount = 0;
    for (const job of jobsToRemove) {
      try {
        await this.removeFailedJob(job.id);
        removedCount++;
      } catch (error) {
        this.logger.warn(`Failed to remove job ${job.id}: ${error.message}`);
      }
    }
    
    this.logger.log(`Cleaned up ${removedCount} old failed jobs`);
    return removedCount;
  }

  /**
   * Bulk retry failed jobs by type
   */
  async retryFailedJobsByType(jobType: string): Promise<number> {
    const failedJobs = await this.getFailedJobs();
    const jobsToRetry = failedJobs.filter(job => job.name === jobType);
    
    let retriedCount = 0;
    for (const job of jobsToRetry) {
      try {
        await this.retryFailedJob(job.id);
        retriedCount++;
      } catch (error) {
        this.logger.warn(`Failed to retry job ${job.id}: ${error.message}`);
      }
    }
    
    this.logger.log(`Retried ${retriedCount} failed jobs of type ${jobType}`);
    return retriedCount;
  }

  /**
   * Extract error type from failure reason for categorization
   */
  private extractErrorType(failedReason: string): string {
    const lowerReason = failedReason.toLowerCase();
    
    if (lowerReason.includes('timeout')) return 'timeout';
    if (lowerReason.includes('rate limit')) return 'rate_limit';
    if (lowerReason.includes('network') || lowerReason.includes('connection')) return 'network';
    if (lowerReason.includes('authentication') || lowerReason.includes('unauthorized')) return 'auth';
    if (lowerReason.includes('validation')) return 'validation';
    if (lowerReason.includes('not found')) return 'not_found';
    if (lowerReason.includes('openai') || lowerReason.includes('api')) return 'external_api';
    
    return 'unknown';
  }
}