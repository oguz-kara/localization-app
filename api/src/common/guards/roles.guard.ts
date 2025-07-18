import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
// import { GqlExecutionContext } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'
import { AccessDeniedException } from '../exceptions/access-denied.exception'
import { RequestContext } from '../request-context/request-context'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    // const ctx = GqlExecutionContext.create(context)
    // const { req } = ctx.getContext()
    const requestContext = RequestContext.fromAsyncStorage()

    if (!requestContext?.user) {
      throw new AccessDeniedException()
    }

    const hasRole = requiredRoles.some(
      (role) => requestContext.user?.role === role,
    )

    if (!hasRole) {
      throw new AccessDeniedException()
    }

    return true
  }
}
