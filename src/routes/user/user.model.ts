import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { RoleSchema } from 'src/shared/models/role.model'
import { UserSchema } from 'src/shared/models/user.model'
import * as z from 'zod'

export const GetPaginatedUsersListRequestQueryParam = GetPaginatedItemsListRequestQuerySchema

export const GetPaginatedUsersListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(
    UserSchema.omit({
      password: true,
      totpSecret: true,
    }).extend({
      role: RoleSchema.pick({
        id: true,
        name: true,
      }),
    }),
  ),
})

export const GetUserRequestParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const CreateUserRequestBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  status: true,
  password: true,
  roleId: true,
}).strict()

export const UpdateUserRequestBodySchema = CreateUserRequestBodySchema

export type GetPaginatedUsersListRequestQueryType = z.infer<typeof GetPaginatedUsersListRequestQueryParam>
export type GetPaginatedUsersListResponseType = z.infer<typeof GetPaginatedUsersListResponseSchema>
export type GetUserRequestParamsType = z.infer<typeof GetUserRequestParamsSchema>
export type CreateUserRequestBodyType = z.infer<typeof CreateUserRequestBodySchema>
export type UpdateUserRequestBodyType = z.infer<typeof UpdateUserRequestBodySchema>
