import { createZodDto } from 'nestjs-zod'
import { RegisterRequestBodySchema, RegisterResponseSchema, SendOTPRequestBodySchema } from 'src/routes/auth/auth.model'

// DTO classes
export class RegisterRequestBodyDTO extends createZodDto(RegisterRequestBodySchema) {}
export class RegisterResponseDTO extends createZodDto(RegisterResponseSchema) {}
export class SendOTPRequestBodyDTO extends createZodDto(SendOTPRequestBodySchema) {}
