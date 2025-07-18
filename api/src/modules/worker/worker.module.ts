import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TranslationModule } from '../translation/translation.module';
import { TranslationJobProcessor } from '../jobs/application/processors/translation-job.processor';
import { TRANSLATION_QUEUE } from '../jobs/domain/constants/queue.constants';
import { PrismaService } from 'src/common/services/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
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
      inject: ['ConfigService'],
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
  providers: [TranslationJobProcessor, PrismaService],
})
export class WorkerModule {}