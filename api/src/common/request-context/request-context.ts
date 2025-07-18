import { AsyncLocalStorage } from 'async_hooks'
import { UserRole } from '@prisma/client'

export interface CtxChannel {
  token?: string
}

export interface CtxUser {
  id: string
  name?: string
  email?: string
  role?: UserRole
}

export interface CtxJWTPayload {
  sub?: string
  jti?: string
  exp?: number
  channelToken?: string
}

export interface CtxApiKey {
  id: string
  name: string
}

export interface RequestContextProps {
  channel: CtxChannel
  user?: CtxUser
  jwtPayload?: CtxJWTPayload
  apiKey?: CtxApiKey
}

export class RequestContext {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>()

  private _channel: CtxChannel
  private readonly _user?: CtxUser
  private readonly _jwtPayload?: CtxJWTPayload
  private readonly _apiKey?: CtxApiKey

  constructor(props: RequestContextProps) {
    this._channel = props.channel
    this._user = props.user
    this._jwtPayload = props.jwtPayload
    this._apiKey = props.apiKey
  }

  static createInstance(props: RequestContextProps): RequestContext {
    return new RequestContext(props)
  }

  static getCurrentContext(): RequestContext {
    const context = RequestContext.asyncLocalStorage.getStore()
    if (!context) {
      throw new Error('Request context is not set')
    }
    return context
  }

  static setCurrentContext(context: RequestContext): void {
    RequestContext.asyncLocalStorage.enterWith(context)
  }

  static fromAsyncStorage(): RequestContext | undefined {
    return RequestContext.asyncLocalStorage.getStore()
  }

  get channel(): CtxChannel {
    return this._channel
  }

  get user(): CtxUser | undefined {
    return this._user
  }

  get jwtPayload(): CtxJWTPayload | undefined {
    return this._jwtPayload
  }

  get apiKey(): CtxApiKey | undefined {
    return this._apiKey
  }

  get channelToken(): string | undefined {
    return this._channel.token
  }
}
