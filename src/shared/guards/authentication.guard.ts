import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
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
    const authTypeValue = this.getAuthTypeValue(context)

    /**
     * Dựa trên danh sách authTypes lấy từ decorator,
     * ánh xạ sang các guard tương ứng (Bearer / ApiKey / None / ...)
     */
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType])

    return authTypeValue.options.condition === ConditionGuard.Or
      ? this.handleOrCondition(guards, context)
      : this.handleAndCondition(guards, context)
  }

  /**
   * Lấy metadata từ decorator `@Auth()` (nếu có).
   * Reflector sẽ đọc metadata từ cả cấp `handler` (method) và `class` (controller).
   * Nếu không có, mặc định sẽ yêu cầu xác thực `Bearer token` và dùng điều kiện `AND`.
   */
  private getAuthTypeValue(context: ExecutionContext): AuthTypeDecoratorPayload {
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.And } }
    return authTypeValue
  }

  /**
   * Xử lý điều kiện `OR`:
   * Duyệt từng guard;
   * Nếu bất kỳ guard nào pass -> cho phép access;
   * Nếu tất cả guard thất bại -> throw exception cuối cùng
   */
  private async handleOrCondition(guards: CanActivate[], context: ExecutionContext) {
    let finalError: any = null

    for (const guard of guards) {
      try {
        const canActive = await guard.canActivate(context)
        if (canActive) return true
      } catch (error) {
        finalError = error
      }
    }

    if (finalError instanceof HttpException) throw finalError
    throw new UnauthorizedException()
  }

  /**
   * Xử lý điều kiện `AND`:
   * Duyệt từng guard;
   * Nếu một guard nào fail → throw exception ngay lập tức;
   * Nếu tất cả đều pass → cho phép truy cập
   */
  private async handleAndCondition(guards: CanActivate[], context: ExecutionContext) {
    for (const guard of guards) {
      try {
        const canActive = await guard.canActivate(context)
        if (!canActive) throw new UnauthorizedException()
      } catch (error) {
        if (error instanceof HttpException) throw error
        throw new UnauthorizedException()
      }
    }
    return true
  }
}
