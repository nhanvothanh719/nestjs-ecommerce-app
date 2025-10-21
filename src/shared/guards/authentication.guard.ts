import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: (_context: ExecutionContext) => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve data passed from @Auth() decorator
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } }

    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType])

    let error = new UnauthorizedException()

    if (authTypeValue.options.condition === ConditionGuard.Or) {
      for (const guard of guards) {
        const canActive = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err
          return false
        })

        if (canActive) return true
      }
      throw error
    } else {
      for (const guard of guards) {
        const canActive = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err
          return false
        })

        if (!canActive) throw error
      }
      return true
    }
  }
}
