import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import envConfig from 'src/shared/config'

const REQUEST_HEADER_X_API_KEY = 'x-api-key'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const xApiKey = request.headers[REQUEST_HEADER_X_API_KEY]

    if (xApiKey !== envConfig.SECRET_API_KEY) throw new UnauthorizedException()
    return true
  }
}
