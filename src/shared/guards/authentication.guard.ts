import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
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
    /**
     * Khởi tạo mapping giữa từng loại cơ chế xác thực và guard xử lý tương ứng.
     * Mục đích: Cho phép chọn guard phù hợp dựa trên metadata từ decorator @Auth().
     */
    this.authTypeGuardMap = {
      // Xác thực bằng Bearer Token (JWT)
      [AuthType.Bearer]: this.accessTokenGuard,
      // Xác thực bằng API Key
      [AuthType.ApiKey]: this.apiKeyGuard,
      // Route public (không yêu cầu xác thực)
      [AuthType.None]: { canActivate: (_context: ExecutionContext) => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * [1] Lấy metadata từ decorator `@Auth()` (nếu có).
     *     Reflector sẽ đọc metadata từ cả cấp handler (method) và class (controller).
     *     Nếu không có, mặc định sẽ yêu cầu xác thực Bearer token và dùng điều kiện AND.
     */
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.And } }

    /**
     * [2️] Dựa trên danh sách authTypes lấy từ decorator, 
     *     ánh xạ sang các guard tương ứng (Bearer / ApiKey / None / ...)
     */
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
