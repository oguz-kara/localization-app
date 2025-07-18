import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiKeyGuard } from '../guards/api-key.guard'

export function ProtectResourceApiKey() {
  return applyDecorators(UseGuards(ApiKeyGuard))
}