import { createZodDto } from 'nestjs-zod'
import {
  LoginRequestBodySchema,
  LogoutRequestBodySchema,
  RefreshTokenRequestBodySchema,
  RegisterRequestBodySchema,
  RegisterResponseSchema,
  SendOTPRequestBodySchema,
} from 'src/routes/auth/auth.model'

// DTO classes used in decorators: @Body, @Request,...
export class RegisterRequestBodyDTO extends createZodDto(RegisterRequestBodySchema) {}
export class RegisterResponseDTO extends createZodDto(RegisterResponseSchema) {}
export class SendOTPRequestBodyDTO extends createZodDto(SendOTPRequestBodySchema) {}
export class LoginRequestBodyDTO extends createZodDto(LoginRequestBodySchema) {}
export class LoginResponseDTO extends createZodDto(LoginRequestBodySchema) {}
export class RefreshTokenRequestBodyDTO extends createZodDto(RefreshTokenRequestBodySchema) {}
export class RefreshTokenResponseDTO extends createZodDto(RegisterRequestBodySchema) {}
export class LogoutRequestBodyDTO extends createZodDto(LogoutRequestBodySchema) {}
