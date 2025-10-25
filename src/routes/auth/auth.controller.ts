import { Body, Controller, Get, HttpCode, Ip, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  GetGoogleAuthUrlResponseDTO,
  LoginRequestBodyDTO,
  LoginResponseDTO,
  LogoutRequestBodyDTO,
  RefreshTokenRequestBodyDTO,
  RefreshTokenResponseDTO,
  RegisterRequestBodyDTO,
  RegisterResponseDTO,
  SendOTPRequestBodyDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleAuthService } from 'src/routes/auth/google-auth.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
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

  @Get('google-auth-url')
  @ZodResponse({ type: GetGoogleAuthUrlResponseDTO })
  @IsPublic()
  getGoogleAuthUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleAuthService.getGoogleAuthorizationUrl({ userAgent, ip })
  }
}
