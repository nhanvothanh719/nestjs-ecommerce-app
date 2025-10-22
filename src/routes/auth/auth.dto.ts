import { createZodDto } from 'nestjs-zod'
import * as z from 'zod'

const RegisterRequestBodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(30),
    name: z.string().min(1).max(50),
    confirmPassword: z.string().min(8).max(30),
    phoneNumber: z.string().min(10).max(15),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'],
      })
    }
  })
export class RegisterRequestBodyDTO extends createZodDto(RegisterRequestBodySchema) {}
