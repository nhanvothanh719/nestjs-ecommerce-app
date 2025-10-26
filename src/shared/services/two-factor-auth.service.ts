import { Injectable } from '@nestjs/common'
import * as OTPAuth from 'otpauth'
import { TWO_FACTOR_AUTHENTICATION } from 'src/shared/constants/auth.constant'

@Injectable()
export class TwoFactorAuthenticationService {
  private createTOTPObject(email: string, secret?: string): OTPAuth.TOTP {
    return new OTPAuth.TOTP({
      issuer: TWO_FACTOR_AUTHENTICATION.ISSUER,
      label: email,
      algorithm: TWO_FACTOR_AUTHENTICATION.ALGORITHM,
      digits: TWO_FACTOR_AUTHENTICATION.DIGITS,
      period: TWO_FACTOR_AUTHENTICATION.PERIOD,
      secret: secret ?? new OTPAuth.Secret(),
    })
  }

  generateTOTPSecret(email: string): { secret: string; uri: string } {
    const totp = this.createTOTPObject(email)
    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    }
  }

  verifyTOTP({ email, otpToken, secret }: { email: string; otpToken: string; secret: string }): boolean {
    const totp = this.createTOTPObject(email, secret)
    const delta = totp.validate({ token: otpToken, window: 1 })
    return delta !== null
  }
}
