import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { Response } from 'express'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth(@Res() res: Response) {
    try {
      // Perform a simple database query to verify connection
      await this.prisma.$queryRaw`SELECT 1`

      return res.status(HttpStatus.OK).json({
        status: 'ok',
        database: 'connected'
      })
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        database: 'disconnected'
      })
    }
  }
}