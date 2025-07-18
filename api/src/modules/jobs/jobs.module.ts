import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationQueueService } from './application/services/translation-queue.service';
import { TranslationJobProcessor } from './application/processors/translation-job.processor';
import { DeadLetterQueueService } from './application/services/dead-letter-queue.service';
import { DeadLetterQueueResolver } from './api/graphql/resolvers/dead-letter-queue.resolver';
import { TRANSLATION_QUEUE } from './domain/constants/queue.constants';
import { TranslationModule } from '../translation/translation.module';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: TRANSLATION_QUEUE,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: false, // Keep failed jobs for dead-letter queue inspection
      },
    }),
    TranslationModule,
  ],
  providers: [TranslationQueueService, TranslationJobProcessor, DeadLetterQueueService, DeadLetterQueueResolver, PrismaService],
  exports: [TranslationQueueService, DeadLetterQueueService],
})
export class JobsModule {}