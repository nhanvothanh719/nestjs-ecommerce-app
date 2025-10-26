import { createZodDto } from 'nestjs-zod'
import {
  Disable2FARequestBodySchema,
  ForgotPasswordRequestBodySchema,
  GetGoogleAuthUrlResponseSchema,
  LoginRequestBodySchema,
  LoginResponseSchema,
  LogoutRequestBodySchema,
  RefreshTokenRequestBodySchema,
  RefreshTokenResponseSchema,
  RegisterRequestBodySchema,
  RegisterResponseSchema,
  SendOTPRequestBodySchema,
  Setup2FAResponseSchema,
} from 'src/routes/auth/auth.model'

// DTO classes used in decorators: @Body, @Request,...
export class RegisterRequestBodyDTO extends createZodDto(RegisterRequestBodySchema) {}
export class RegisterResponseDTO extends createZodDto(RegisterResponseSchema) {}
export class SendOTPRequestBodyDTO extends createZodDto(SendOTPRequestBodySchema) {}
export class LoginRequestBodyDTO extends createZodDto(LoginRequestBodySchema) {}
export class LoginResponseDTO extends createZodDto(LoginResponseSchema) {}
export class RefreshTokenRequestBodyDTO extends createZodDto(RefreshTokenRequestBodySchema) {}
export class RefreshTokenResponseDTO extends createZodDto(RefreshTokenResponseSchema) {}
export class LogoutRequestBodyDTO extends createZodDto(LogoutRequestBodySchema) {}
export class GetGoogleAuthUrlResponseDTO extends createZodDto(GetGoogleAuthUrlResponseSchema) {}
export class ForgotPasswordRequestBodyDTO extends createZodDto(ForgotPasswordRequestBodySchema) {}
export class Setup2FAResponseDTO extends createZodDto(Setup2FAResponseSchema) {}
export class Disable2FARequestBodyDTO extends createZodDto(Disable2FARequestBodySchema) {}
