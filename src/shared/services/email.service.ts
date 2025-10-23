import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendVerificationCodeMail(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['nhanvothanh719@gmail.com'],
      subject: 'Verification code',
      html: `>>> Code: ${payload.code}`,
    })
  }
}
