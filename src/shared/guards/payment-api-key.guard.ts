import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import envConfig from 'src/shared/config'

const REQUEST_HEADER_PAYMENT_API_KEY = 'payment-api-key'

@Injectable()
export class PaymentApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const xApiKey = request.headers[REQUEST_HEADER_PAYMENT_API_KEY]

    if (xApiKey !== envConfig.PAYMENT_API_KEY) throw new UnauthorizedException()
    return true
  }
}
