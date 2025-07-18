import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { RequestContext } from '../../request-context/request-context'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.setupAuditMiddleware()
  }

  private setupAuditMiddleware() {
    this.$use(async (params, next) => {
      if (params.model === 'Translation') {
        const { action, args } = params

        if (action === 'update' || action === 'updateMany') {
          const ctx = RequestContext.fromAsyncStorage()

          if (ctx?.user?.id) {
            // Get the original translation before update
            const originalTranslation = await this.translation.findUnique({
              where: { id: args.where.id },
              select: { value: true, status: true },
            })

            // Execute the update
            const result = await next(params)

            // Get the updated translation
            const updatedTranslation = await this.translation.findUnique({
              where: { id: args.where.id },
              select: { value: true, status: true },
            })

            // Create audit log entry
            if (originalTranslation && updatedTranslation) {
              await this.translationHistory.create({
                data: {
                  action: 'UPDATE',
                  oldValue: originalTranslation.value,
                  newValue: updatedTranslation.value,
                  oldStatus: originalTranslation.status,
                  newStatus: updatedTranslation.status,
                  translationId: args.where.id,
                  userId: ctx.user.id,
                },
              })
            }

            return result
          }
        }

        if (action === 'create' || action === 'createMany') {
          const ctx = RequestContext.fromAsyncStorage()

          if (ctx?.user?.id) {
            // Execute the create
            const result = await next(params)

            // Create audit log entry
            if (result && result.id) {
              await this.translationHistory.create({
                data: {
                  action: 'CREATE',
                  oldValue: null,
                  newValue: result.value,
                  oldStatus: null,
                  newStatus: result.status,
                  translationId: result.id,
                  userId: ctx.user.id,
                },
              })
            }

            return result
          }
        }

        if (action === 'delete' || action === 'deleteMany') {
          const ctx = RequestContext.fromAsyncStorage()

          if (ctx?.user?.id) {
            // Get the original translation before deletion
            const originalTranslation = await this.translation.findUnique({
              where: { id: args.where.id },
              select: { value: true, status: true },
            })

            // Execute the delete
            const result = await next(params)

            // Create audit log entry
            if (originalTranslation) {
              await this.translationHistory.create({
                data: {
                  action: 'DELETE',
                  oldValue: originalTranslation.value,
                  newValue: null,
                  oldStatus: originalTranslation.status,
                  newStatus: null,
                  translationId: args.where.id,
                  userId: ctx.user.id,
                },
              })
            }

            return result
          }
        }
      }

      return next(params)
    })
  }
}
