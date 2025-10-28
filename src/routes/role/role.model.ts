import { PermissionSchema } from 'src/shared/models/permission.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { RoleSchema } from 'src/shared/models/role.model'
import * as z from 'zod'

export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
})

export const GetRolesListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetRolesListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(RoleSchema),
})

export const GetRoleRequestParamsSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict()

export const RoleDetailsSchema = RoleWithPermissionsSchema

export const CreateRoleRequestBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict()

export const CreateRoleResponseSchema = RoleSchema

export const UpdateRoleRequestBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
})
  .extend({
    permissionIds: z.array(z.number()),
  })
  .strict()

export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>
export type GetRolesListRequestQueryType = z.infer<typeof GetRolesListRequestQuerySchema>
export type GetRolesListResponseType = z.infer<typeof GetRolesListResponseSchema>
export type GetRoleRequestParamsType = z.infer<typeof GetRoleRequestParamsSchema>
export type RoleDetailsType = z.infer<typeof RoleDetailsSchema>
export type CreateRoleRequestBodyType = z.infer<typeof CreateRoleRequestBodySchema>
export type CreateRoleResponseType = z.infer<typeof CreateRoleResponseSchema>
export type UpdateRoleRequestBodyType = z.infer<typeof UpdateRoleRequestBodySchema>
