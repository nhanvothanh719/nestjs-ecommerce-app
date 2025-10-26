import { Injectable } from '@nestjs/common'
import { CreateEmailResponse, Resend } from 'resend'
import envConfig from 'src/shared/config'
import fs from 'fs'
import path from 'path'
import { render } from '@react-email/render'
import VerificationCodeEmail from 'src/shared/email-templates/react-email/verification-code-email'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  /**
   * Send email with verification code using HTML template
   * @param payload
   * @returns
   */
  async sendVerificationCodeMail(payload: { email: string; code: string }): Promise<CreateEmailResponse> {
    const otpTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/verification-code.html'), {
      encoding: 'utf-8',
    })
    const subject = 'Verification code'
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [envConfig.ADMIN_USER_EMAIL], // TODO: payload.email
      subject,
      html: otpTemplate.replaceAll('{{ preheaderText }}', subject).replaceAll('{{ code }}', payload.code),
    })
  }

  /**
   * Send email with verification code using `react-email`
   * @param payload
   * @returns
   */
  async sendVerificationCodeMailWithReactEmail(payload: { email: string; code: string }): Promise<CreateEmailResponse> {
    const subject = 'Verification code'
    const html = await render(
      VerificationCodeEmail({
        verificationCode: payload.code,
        title: subject,
      }),
    )
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [envConfig.ADMIN_USER_EMAIL], // TODO: payload.email
      subject,
      html,
    })
  }
}
