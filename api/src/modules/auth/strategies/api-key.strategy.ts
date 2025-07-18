import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import * as crypto from 'crypto'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async validate(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('API key is required')
    }

    // Hash the incoming token to compare with stored hash
    const keyHash = crypto.createHash('sha256').update(token).digest('hex')

    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: { channel: true },
    })

    if (!apiKey || !apiKey.isActive) {
      throw new UnauthorizedException('Invalid or inactive API key')
    }

    return {
      apiKeyId: apiKey.id,
      channelToken: apiKey.channelToken,
      channel: apiKey.channel,
      keyName: apiKey.name,
    }
  }
}
