import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { ProjectService } from './application/services/project.service'
import { TranslationKeyService } from './application/services/translation-key.service'
import { TranslationService } from './application/services/translation.service'
import { ProjectResolver } from './api/graphql/resolvers/project.resolver'
import { TranslationKeyResolver } from './api/graphql/resolvers/translation-key.resolver'
import { TranslationResolver } from './api/graphql/resolvers/translation.resolver'

@Module({
  providers: [
    PrismaService,
    ProjectService,
    TranslationKeyService,
    TranslationService,
    ProjectResolver,
    TranslationKeyResolver,
    TranslationResolver,
  ],
  exports: [ProjectService, TranslationKeyService, TranslationService],
})
export class ProjectModule {}