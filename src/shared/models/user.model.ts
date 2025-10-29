import { UserStatus } from 'src/shared/constants/auth.constant'
import { PermissionSchema } from 'src/shared/models/permission.model'
import { RoleSchema } from 'src/shared/models/role.model'
import * as z from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
  phoneNumber: z.string().min(9).max(15),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().positive(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Apply for response of APIs: GET('profile'), GET('users/:id')
 */
export const GetUserProfileResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        module: true,
        path: true,
        method: true,
      }),
    ),
  }),
})

/**
 * Apply for response of APIs: PUT('profile'), PUT('users/:id')
 */
export const UpdateUserProfileResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export type UserType = z.infer<typeof UserSchema>
export type GetUserProfileResponseType = z.infer<typeof GetUserProfileResponseSchema>
export type UpdateUserProfileResponseType = z.infer<typeof UpdateUserProfileResponseSchema>
