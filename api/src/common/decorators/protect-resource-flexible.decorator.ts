import { applyDecorators, UseGuards } from '@nestjs/common'
import { FlexibleAuthGuard } from '../guards/flexible-auth.guard'

// Combined guard that accepts either JWT or API key authentication
export function ProtectResourceFlexible() {
  return applyDecorators(
    UseGuards(FlexibleAuthGuard),
  )
}