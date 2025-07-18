# Background Job Infrastructure

This document describes the background job infrastructure implemented for the localization service, including automated translation, queue management, and resilience patterns.

## Architecture Overview

The background job system consists of three main components:

1. **Job Queue** - Redis-backed BullMQ queue for job management
2. **Translation Engine** - AI-powered translation providers with failover
3. **Worker Service** - Stateless job processor that can scale horizontally

## Key Features

### 1. Background Job Infrastructure
- **Redis & BullMQ**: Production-ready queue management
- **Stateless Workers**: Horizontally scalable job processors
- **Job Persistence**: All jobs are persisted in Redis
- **Graceful Shutdown**: Workers handle SIGTERM/SIGINT properly

### 2. Automated Translation Engine
- **Provider Interface**: Abstraction for different translation services
- **OpenAI Provider**: GPT-4o-mini powered translations
- **Batch Processing**: Efficient handling of multiple translations
- **Cost Estimation**: Built-in cost calculation for translation jobs

### 3. Resilience Patterns
- **Exponential Backoff**: Automatic retry with increasing delays
- **Dead Letter Queue**: Failed jobs are preserved for manual inspection
- **Circuit Breaker**: Prevents cascade failures
- **Rate Limiting**: Protects external APIs from overload

## Components

### Job Types

#### 1. Project Translation Sync
```typescript
interface SyncProjectTranslationsJobData {
  projectId: string;
  sourceLanguage: string;
  targetLanguages: string[];
  channelToken: string;
  userId: string;
}
```

#### 2. Single Translation Sync
```typescript
interface SyncSingleTranslationJobData {
  translationKeyId: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  channelToken: string;
  userId: string;
}
```

### Translation Providers

#### OpenAI Provider
- **Model**: GPT-4o-mini for cost-effectiveness
- **Languages**: 60+ supported languages
- **Features**: Context-aware translations, formality control
- **Pricing**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

#### Provider Interface
```typescript
abstract class TranslationProvider {
  abstract translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult>;
  abstract translateBatch(texts: string[], sourceLanguage: string, targetLanguage: string): Promise<TranslationResult[]>;
  abstract supportsLanguagePair(sourceLanguage: string, targetLanguage: string): boolean;
  abstract healthCheck(): Promise<boolean>;
}
```

### Queue Configuration

#### Retry Strategy
- **Attempts**: 5 for translation jobs, 3 for general jobs
- **Backoff**: Exponential with 2-3 second base delay
- **Max Delay**: ~81 seconds for translation jobs
- **Failed Job Retention**: Kept permanently for inspection

#### Job Lifecycle
1. **Queued** - Job created and waiting for processing
2. **Active** - Being processed by a worker
3. **Completed** - Successfully finished
4. **Failed** - All retries exhausted, moved to dead letter queue

## Usage

### Starting the System

1. **Start Infrastructure**
```bash
docker-compose up -d
```

2. **Start API Server**
```bash
cd api
pnpm run start:dev
```

3. **Start Worker** (separate terminal)
```bash
cd api
pnpm run worker
```

### GraphQL Mutations

#### Sync Project Translations
```graphql
mutation SyncProjectTranslations {
  syncTranslations(input: {
    type: PROJECT
    projectId: "project-id"
    sourceLanguage: "en"
    targetLanguages: ["es", "fr", "de"]
  }) {
    success
    jobId
    message
    estimatedDuration
    totalKeys
    totalLanguages
  }
}
```

#### Sync Single Translation
```graphql
mutation SyncSingleTranslation {
  syncTranslations(input: {
    type: SINGLE_KEY
    translationKeyId: "key-id"
    sourceLanguage: "en"
    targetLanguage: "es"
    sourceText: "Hello, world!"
  }) {
    success
    jobId
    message
    estimatedDuration
  }
}
```

### Dead Letter Queue Management

#### View Failed Jobs
```graphql
query FailedJobs {
  failedJobs {
    id
    name
    data
    failedReason
    attemptsMade
    maxAttempts
    failedAt
  }
}
```

#### Retry Failed Job
```graphql
mutation RetryFailedJob {
  retryFailedJob(jobId: "job-id") {
    success
    message
  }
}
```

#### Get Failed Job Statistics
```graphql
query FailedJobStats {
  failedJobStats {
    totalFailed
    jobsByType
    jobsByFailureReason
    oldestFailedJob
    newestFailedJob
  }
}
```

## Deployment

### Docker Compose
The system includes a complete Docker setup:

```yaml
services:
  localization-worker:
    build:
      context: ./api
      dockerfile: Dockerfile.worker
    depends_on:
      - localization-db
      - localization-redis
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_HOST=localization-redis
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# OpenAI
OPENAI_API_KEY=your_openai_key

# Optional
LOG_LEVEL=info
NODE_ENV=production
```

### Scaling Workers
Workers are stateless and can be scaled horizontally:

```bash
# Start multiple workers
docker-compose up --scale localization-worker=3
```

## Monitoring

### Health Checks
- **Worker Health**: Built-in health check every 30 seconds
- **Redis Health**: Connection monitoring with ping
- **Provider Health**: Translation provider availability

### Metrics
- **Queue Stats**: Waiting, active, completed, failed job counts
- **Job Duration**: Processing time tracking
- **Error Rates**: Failure categorization and trends
- **Cost Tracking**: Translation provider usage costs

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Request Tracing**: Full request lifecycle tracking

## Error Handling

### Common Errors
1. **Rate Limiting**: 429 responses from OpenAI
2. **Network Timeouts**: Connection issues
3. **Authentication**: Invalid API keys
4. **Validation**: Malformed translation requests
5. **Not Found**: Missing translation keys/projects

### Error Recovery
- **Automatic Retry**: For transient errors
- **Dead Letter Queue**: For permanent failures
- **Manual Intervention**: Admin tools for failed jobs
- **Alerting**: Notification system for critical failures

## Best Practices

### Queue Management
- **Job Deduplication**: Prevent duplicate work
- **Priority Queues**: Handle urgent translations first
- **Batch Processing**: Group similar translations
- **Resource Limits**: Prevent memory exhaustion

### Translation Quality
- **Context Preservation**: Include developer notes
- **Formality Control**: Respect target audience
- **Quality Checks**: Validate translation results
- **Human Review**: Workflow for quality assurance

### Cost Optimization
- **Token Estimation**: Accurate cost prediction
- **Batch Optimization**: Reduce API calls
- **Caching**: Store frequently used translations
- **Provider Selection**: Choose cost-effective providers

## Troubleshooting

### Common Issues

1. **Workers Not Processing Jobs**
   - Check Redis connection
   - Verify queue configuration
   - Check worker logs

2. **Translation Failures**
   - Validate OpenAI API key
   - Check rate limits
   - Verify language support

3. **Memory Issues**
   - Monitor job payload size
   - Adjust worker memory limits
   - Check for memory leaks

### Debug Commands
```bash
# View queue stats
redis-cli -h localhost -p 6379 -a password INFO

# Check worker logs
docker logs localization-worker

# View failed jobs
docker exec -it localization-redis redis-cli -a password
```

## Future Enhancements

### Planned Features
1. **Multiple Providers**: Google Translate, DeepL integration
2. **Quality Metrics**: Translation confidence scoring
3. **Workflow Integration**: Human review processes
4. **Analytics Dashboard**: Real-time job monitoring
5. **Auto-scaling**: Dynamic worker scaling based on queue size

### Performance Optimizations
1. **Connection Pooling**: Reduce Redis connection overhead
2. **Batch Processing**: Optimize API calls
3. **Caching Layer**: Store common translations
4. **Compression**: Reduce job payload size

## Security Considerations

1. **API Key Management**: Secure storage and rotation
2. **Data Encryption**: Encrypt sensitive translation data
3. **Access Control**: Restrict queue operations
4. **Audit Logging**: Track all job operations
5. **Rate Limiting**: Prevent abuse and DoS attacks