import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './modules/worker/worker.module';

async function bootstrap() {
  const logger = new Logger('Worker');
  
  try {
    const app = await NestFactory.create(WorkerModule);
    
    // Enable graceful shutdown
    app.enableShutdownHooks();
    
    await app.init();
    
    logger.log('Translation worker started successfully');
    
    // Keep the process running
    process.on('SIGTERM', async () => {
      logger.log('SIGTERM received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.log('SIGINT received, shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
}

bootstrap();