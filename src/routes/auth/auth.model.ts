import { VerificationCodeGenre } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/user.model'
import z from 'zod'

export const RegisterRequestBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
    code: z.string().length(6),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'],
      })
    }
  })

export const RegisterResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum([VerificationCodeGenre.REGISTER, VerificationCodeGenre.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export const SendOTPRequestBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export type RegisterRequestBodyType = z.infer<typeof RegisterRequestBodySchema>
export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
export type SendOTPRequestBodyType = z.infer<typeof SendOTPRequestBodySchema>
