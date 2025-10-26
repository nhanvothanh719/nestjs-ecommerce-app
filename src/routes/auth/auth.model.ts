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
    confirmPassword: z.string().min(8).max(100),
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
  type: z.enum([
    VerificationCodeGenre.REGISTER,
    VerificationCodeGenre.FORGOT_PASSWORD,
    VerificationCodeGenre.LOGIN,
    VerificationCodeGenre.DISABLE_2FA,
  ]),
  createdAt: z.date(),
  expiresAt: z.date(),
})

export const SendOTPRequestBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export const LoginRequestBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    totpCode: z.string().length(6).optional(),
    emailCode: z.string().length(6).optional(),
  })
  .strict()

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const RefreshTokenRequestBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict()

export const RefreshTokenResponseSchema = LoginResponseSchema

export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  isActive: z.boolean(),
  lastActive: z.date(),
  createdAt: z.date(),
})

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export const LogoutRequestBodySchema = RefreshTokenRequestBodySchema

export const GoogleAuthStateSchema = DeviceSchema.pick({
  userAgent: true,
  ip: true,
})

export const GetGoogleAuthUrlResponseSchema = z.object({
  url: z.url(),
})

export const ForgotPasswordRequestBodySchema = z
  .object({
    email: z.email(),
    code: z.string().length(6),
    newPassword: z.string().min(8).max(100),
    confirmNewPassword: z.string().min(8).max(100),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmNewPassword'],
      })
    }
  })

export const Setup2FAResponseSchema = z.object({
  secret: z.string(),
  url: z.string(),
})

export const Disable2FARequestBodySchema = z
  .object({
    totpCode: z.string().length(6).optional(),
    emailCode: z.string().length(6).optional(),
  })
  .strict()
  .superRefine(({ totpCode, emailCode }, ctx) => {
    // Trả về lỗi nếu xảy ra TH cả TOTP và Email OTP đều có hoặc không có giá trị
    if ((totpCode !== undefined) === (emailCode !== undefined)) {
      const errorMessage = 'You must choose one of two methods for authentication'
      ctx.addIssue({
        path: ['totpCode'],
        message: errorMessage,
        code: 'custom',
      })
      ctx.addIssue({
        path: ['code'],
        message: errorMessage,
        code: 'custom',
      })
    }
  })

export type RegisterRequestBodyType = z.infer<typeof RegisterRequestBodySchema>
export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>
export type SendOTPRequestBodyType = z.infer<typeof SendOTPRequestBodySchema>
export type LoginRequestBodyType = z.infer<typeof LoginRequestBodySchema>
export type LoginResponseType = z.infer<typeof LoginResponseSchema>
export type RefreshTokenRequestBodyType = z.infer<typeof RefreshTokenRequestBodySchema>
export type RefreshTokenResponseType = z.infer<typeof RefreshTokenResponseSchema>
export type DeviceType = z.infer<typeof DeviceSchema>
export type RoleType = z.infer<typeof RoleSchema>
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>
export type LogoutRequestBodyType = z.infer<typeof LogoutRequestBodySchema>
export type GoogleAuthStateType = z.infer<typeof GoogleAuthStateSchema>
export type ForgotPasswordRequestBodyType = z.infer<typeof ForgotPasswordRequestBodySchema>
export type Setup2FAResponseType = z.infer<typeof Setup2FAResponseSchema>
export type Disable2FARequestBodyType = z.infer<typeof Disable2FARequestBodySchema>
