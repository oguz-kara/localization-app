import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common'
import { AuthService } from './application/services/auth.service'
import { AuthResolver } from './api/graphql/resolvers/auth.resolver'
import { UserResolver } from './api/graphql/resolvers/user.resolver'
import { ApiKeyResolver } from './api/graphql/resolvers/api-key.resolver'
import { UserService } from './application/services/user.service'
import { ApiKeyService } from './application/services/api-key.service'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from 'src/common/services/cache/cache.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ApiKeyStrategy } from './strategies/api-key.strategy'
import { ChannelModule } from '../channel'

@Module({
  imports: [
    ChannelModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
        },
      }),
    }),
    CacheModule,
  ],
  providers: [
    PrismaService,
    AuthService,
    UserService,
    ApiKeyService,
    AuthResolver,
    UserResolver,
    ApiKeyResolver,
    JwtStrategy,
    ApiKeyStrategy,
  ],
  exports: [AuthService, UserService, ApiKeyService],
})
export class AuthModule {}
