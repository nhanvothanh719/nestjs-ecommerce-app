import { Body, Controller, HttpCode, Ip, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
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
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: RegisterResponseDTO })
  async register(@Body() body: RegisterRequestBodyDTO) {
    const result = await this.authService.register(body)
    return result
  }

  @Post('login')
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
  @ZodResponse({ type: ResponseMessageDTO })
  async sendOTP(@Body() body: SendOTPRequestBodyDTO) {
    const result = await this.authService.sendOTP(body)
    return result
  }
}
