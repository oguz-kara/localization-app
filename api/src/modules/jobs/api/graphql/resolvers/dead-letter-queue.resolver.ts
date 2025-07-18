import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'
import { DeadLetterQueueService } from '../../../application/services/dead-letter-queue.service'
import {
  FailedJobOutput,
  FailedJobStatsOutput,
  RetryJobResult,
} from '../dto/failed-job.output'

@Resolver()
export class DeadLetterQueueResolver {
  constructor(
    private readonly deadLetterQueueService: DeadLetterQueueService,
  ) {}

  @Query(() => [FailedJobOutput], { name: 'failedJobs' })
  @ProtectResource()
  async getFailedJobs(): Promise<FailedJobOutput[]> {
    const failedJobs = await this.deadLetterQueueService.getFailedJobs()
    return failedJobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      processedOn: job.processedOn ?? undefined,
      finishedOn: job.finishedOn ?? undefined,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.maxAttempts,
      createdAt: job.createdAt,
      failedAt: job.failedAt,
    }))
  }

  @Query(() => FailedJobOutput, { name: 'failedJob', nullable: true })
  @ProtectResource()
  async getFailedJob(
    @Ctx() ctx: RequestContext,
    @Args('jobId') jobId: string,
  ): Promise<FailedJobOutput | null> {
    const job = await this.deadLetterQueueService.getFailedJob(jobId)
    if (!job) return null

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      failedReason: job.failedReason,
      processedOn: job.processedOn ?? undefined,
      finishedOn: job.finishedOn ?? undefined,
      attemptsMade: job.attemptsMade,
      maxAttempts: job.maxAttempts,
      createdAt: job.createdAt,
      failedAt: job.failedAt,
    }
  }

  @Query(() => FailedJobStatsOutput, { name: 'failedJobStats' })
  @ProtectResource()
  async getFailedJobStats(): Promise<FailedJobStatsOutput> {
    const stats = await this.deadLetterQueueService.getFailedJobStats()
    return {
      totalFailed: stats.totalFailed,
      jobsByType: stats.jobsByType,
      jobsByFailureReason: stats.jobsByFailureReason,
      oldestFailedJob: stats.oldestFailedJob ?? undefined,
      newestFailedJob: stats.newestFailedJob ?? undefined,
    }
  }

  @Mutation(() => RetryJobResult, { name: 'retryFailedJob' })
  @ProtectResource()
  async retryFailedJob(@Args('jobId') jobId: string): Promise<RetryJobResult> {
    try {
      await this.deadLetterQueueService.retryFailedJob(jobId)
      return {
        success: true,
        message: `Job ${jobId} has been retried successfully`,
        jobId,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to retry job ${jobId}: ${error.message}`,
        jobId,
      }
    }
  }

  @Mutation(() => RetryJobResult, { name: 'retryFailedJobsByType' })
  @ProtectResource()
  async retryFailedJobsByType(
    @Args('jobType') jobType: string,
  ): Promise<RetryJobResult> {
    try {
      const retriedCount =
        await this.deadLetterQueueService.retryFailedJobsByType(jobType)
      return {
        success: true,
        message: `Successfully retried ${retriedCount} jobs of type ${jobType}`,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to retry jobs of type ${jobType}: ${error.message}`,
      }
    }
  }

  @Mutation(() => RetryJobResult, { name: 'removeFailedJob' })
  @ProtectResource()
  async removeFailedJob(@Args('jobId') jobId: string): Promise<RetryJobResult> {
    try {
      await this.deadLetterQueueService.removeFailedJob(jobId)
      return {
        success: true,
        message: `Job ${jobId} has been removed successfully`,
        jobId,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to remove job ${jobId}: ${error.message}`,
        jobId,
      }
    }
  }

  @Mutation(() => RetryJobResult, { name: 'cleanupOldFailedJobs' })
  @ProtectResource()
  async cleanupOldFailedJobs(
    @Args('olderThanDays', { defaultValue: 30 }) olderThanDays: number,
  ): Promise<RetryJobResult> {
    try {
      const removedCount =
        await this.deadLetterQueueService.cleanupOldFailedJobs(olderThanDays)
      return {
        success: true,
        message: `Successfully removed ${removedCount} old failed jobs`,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to cleanup old failed jobs: ${error.message}`,
      }
    }
  }
}
