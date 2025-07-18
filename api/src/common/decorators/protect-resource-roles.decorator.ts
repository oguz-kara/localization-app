import { applyDecorators, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { IdentityGuard } from '../guards/identity.guard'
import { RolesGuard } from '../guards/roles.guard'
import { Roles } from './roles.decorator'

export function ProtectResourceRoles(...roles: UserRole[]) {
  return applyDecorators(
    UseGuards(IdentityGuard, RolesGuard),
    Roles(...roles)
  )
}

export function ProtectResourceFlexibleRoles(...roles: UserRole[]) {
  return applyDecorators(
    UseGuards(IdentityGuard, RolesGuard),
    Roles(...roles)
  )
}