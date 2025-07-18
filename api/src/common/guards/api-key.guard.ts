import { Injectable, ExecutionContext, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AccessDeniedException } from '../exceptions/access-denied.exception'

@Injectable()
export class ApiKeyGuard extends AuthGuard('api-key') {
  private readonly logger = new Logger(ApiKeyGuard.name)

  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context)
    return gqlCtx.getContext().req
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.warn(
        `ApiKeyGuard: Authentication failed. Info: ${info?.message || info || 'No user object'}. Error: ${err?.message || err}`,
      )
      throw err || new AccessDeniedException()
    }
    return user
  }
}