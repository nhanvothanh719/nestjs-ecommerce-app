import { UserSchema } from 'src/shared/models/user.model'
import * as z from 'zod'

export const UpdateMyProfileRequestBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
}).strict()

export const ChangePasswordRequestBodySchema = UserSchema.pick({
  password: true,
})
  .extend({
    newPassword: z.string().min(8).max(100),
    confirmNewPassword: z.string().min(8).max(100),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Error.ConfirmPasswordDoNotMatch',
        path: ['confirmNewPassword'],
      })
    }
  })

export type UpdateMyProfileRequestBodyType = z.infer<typeof UpdateMyProfileRequestBodySchema>
export type ChangePasswordRequestBodyType = z.infer<typeof ChangePasswordRequestBodySchema>
