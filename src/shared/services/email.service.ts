import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'
import fs from 'fs'
import path from 'path'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendVerificationCodeMail(payload: { email: string; code: string }) {
    const otpTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/verification-code.html'), {
      encoding: 'utf-8',
    })
    const subject = 'Verification code'
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['nhanvothanh719@gmail.com'],
      subject,
      html: otpTemplate.replaceAll('{{ preheaderText }}', subject).replaceAll('{{ code }}', payload.code),
    })
  }
}
