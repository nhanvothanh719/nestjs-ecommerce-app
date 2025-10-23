import { UserStatus } from 'generated/prisma'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
})

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

// DTO classes
export class RegisterRequestBodyDTO extends createZodDto(RegisterRequestBodySchema) {}
export class RegisterResponseDTO extends createZodDto(UserSchema) {}
