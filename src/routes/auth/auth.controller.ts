import { Body, Controller, Get, HttpCode, Ip, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ZodResponse } from 'nestjs-zod'
import {
  ForgotPasswordRequestBodyDTO,
  GetGoogleAuthUrlResponseDTO,
  LoginRequestBodyDTO,
  LoginResponseDTO,
  LogoutRequestBodyDTO,
  RefreshTokenRequestBodyDTO,
  RefreshTokenResponseDTO,
  RegisterRequestBodyDTO,
  RegisterResponseDTO,
  SendOTPRequestBodyDTO,
  Setup2FAResponseDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleAuthService } from 'src/routes/auth/google-auth.service'
import envConfig from 'src/shared/config'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { EmptyRequestBodyDTO } from 'src/shared/dtos/request.dto'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('register')
  @IsPublic()
  @ZodResponse({ type: RegisterResponseDTO })
  async register(@Body() body: RegisterRequestBodyDTO) {
    const result = await this.authService.register(body)
    return result
  }

  @Post('login')
  @IsPublic()
  @ZodResponse({ type: LoginResponseDTO })
  async login(@Body() body: LoginRequestBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    const result = await this.authService.login({
      ...body,
      userAgent,
      ip,
    })
    return result
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(200)
  @ZodResponse({ type: RefreshTokenResponseDTO })
  async refreshToken(@Body() body: RefreshTokenRequestBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    const result = await this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    })
    return result
  }

  @Post('logout')
  @HttpCode(200)
  @ZodResponse({ type: ResponseMessageDTO })
  async logout(@Body() body: LogoutRequestBodyDTO) {
    const result = await this.authService.logout(body.refreshToken)
    return result
  }

  @Post('otp')
  @IsPublic()
  @ZodResponse({ type: ResponseMessageDTO })
  async sendOTP(@Body() body: SendOTPRequestBodyDTO) {
    const result = await this.authService.sendOTP(body)
    return result
  }

  @Get('google/auth-url')
  @ZodResponse({ type: GetGoogleAuthUrlResponseDTO })
  @IsPublic()
  getGoogleAuthUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleAuthService.getGoogleAuthorizationUrl({ userAgent, ip })
  }

  @Get('google/callback')
  @IsPublic()
  async handleGoogleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.googleAuthService.handleGoogleCallback({ code, state })
      // MEMO: Not good
      // TODO: Set tokens as secure, httpOnly cookies before redirecting
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error in handling Google callback'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodResponse({ type: ResponseMessageDTO })
  async forgotPassword(@Body() body: ForgotPasswordRequestBodyDTO) {
    return await this.authService.forgotPassword(body)
  }

  // MEMO: Dùng `@Post()` mang ý nghĩa tạo ra + tránh việc tạo OTP Token thông qua URL trên browser
  @Post('2fa/setup')
  @ZodResponse({ type: Setup2FAResponseDTO })
  async setup2FA(@Body() _body: EmptyRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return await this.authService.setup2FA(userId)
  }
}
