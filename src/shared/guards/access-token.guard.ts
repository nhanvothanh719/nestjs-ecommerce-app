import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Guard entrypoint — xác thực access token và kiểm tra quyền truy cập.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const decodedAccessToken = await this.verifyAccessTokenAndAttachAdditionalFields(request)

    // Check user permission
    await this.checkRolePermission(request, decodedAccessToken)
    return true
  }

  /**
   * Trích xuất access token từ header Authorization,
   * xác thực token, và gán payload vào request.
   */
  private async verifyAccessTokenAndAttachAdditionalFields(request: any): Promise<AccessTokenPayload> {
    const accessToken = this.extractAccessTokenFromHeader(request)
    try {
      const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken)
      // Assign value for: request['user']
      request[REQUEST_USER_KEY] = decodedAccessToken
      return decodedAccessToken
    } catch {
      throw new UnauthorizedException('Error.InvalidAccessToken')
    }
  }

  private async checkRolePermission(request: any, decodedAccessToken: AccessTokenPayload): Promise<void> {
    const { roleId } = decodedAccessToken
    const { path } = request.route
    const { method } = request

    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
          deletedAt: null,
        },
        include: {
          permissions: {
            where: {
              path,
              method,
              deletedAt: null,
            },
          },
        },
      })
      .catch((error) => {
        throw new ForbiddenException()
      })

    const canAccess = role.permissions.length > 0

    if (!canAccess) throw new ForbiddenException()
  }

  private extractAccessTokenFromHeader(request: any): string {
    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) throw new UnauthorizedException('Error.MissingAccessToken')
    return accessToken
  }
}
