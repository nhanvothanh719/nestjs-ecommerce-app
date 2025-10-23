import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { RegisterRequestBodyDTO, RegisterResponseDTO } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: RegisterResponseDTO })
  async register(@Body() body: RegisterRequestBodyDTO) {
    const result = await this.authService.register(body)
    return result
  }

  // @Post('login')
  // async login(@Body() body: any) {
  //   const result = await this.authService.login(body)
  //   return result
  // }

  // @Post('refresh-token')
  // @HttpCode(200)
  // async refreshToken(@Body() body: any) {
  //   const result = await this.authService.refreshToken(body.refreshToken as string)
  //   return result
  // }

  // @Post('logout')
  // async logout(@Body() body: any) {
  //   const result = await this.authService.logout(body.refreshToken as string)
  //   return result
  // }
}
