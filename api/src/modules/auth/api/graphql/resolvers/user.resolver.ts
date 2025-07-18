import { Args, Query, Resolver } from '@nestjs/graphql'
import { RequestContext } from 'src/common/request-context/request-context'
import { Ctx } from 'src/common/request-context/request-context.decorator'
import { UserEntity } from '../entities/user.entity'
import { UserService } from 'src/modules/auth/application/services/user.service'
import { UserConnectionObject } from '../dto/user-connection.object-type'
import { ProtectResource } from 'src/common/decorators/protect-resource.decorator'

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserConnectionObject, { name: 'getUsers' })
  @ProtectResource()
  async getUsers(
    @Ctx() ctx: RequestContext,
    @Args('skip') skip: number,
    @Args('take') take: number,
  ): Promise<UserConnectionObject> {
    return this.userService.getUsers(ctx, { skip, take })
  }

  @Query(() => UserEntity, { name: 'getUser' })
  @ProtectResource()
  async getUser(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
  ): Promise<UserEntity | null> {
    return this.userService.getUser(ctx, id)
  }

  @Query(() => UserEntity, { name: 'getUserByEmail' })
  @ProtectResource()
  async getUserByEmail(
    @Ctx() ctx: RequestContext,
    @Args('email') email: string,
  ): Promise<UserEntity | null> {
    return this.userService.getUserByEmail(ctx, email)
  }
}
