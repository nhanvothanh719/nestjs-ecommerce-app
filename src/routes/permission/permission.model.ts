import { PermissionSchema } from 'src/shared/models/permission.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

export const GetPermissionsListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetPermissionsListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(PermissionSchema),
})

export const GetPermissionRequestParamsSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict()

export const PermissionDetailsSchema = PermissionSchema

export const CreatePermissionRequestBodySchema = PermissionSchema.pick({
  name: true,
  path: true,
  method: true,
  module: true,
  description: true,
})

export const UpdatePermissionRequestBodySchema = CreatePermissionRequestBodySchema

export type GetPermissionsListRequestQueryType = z.infer<typeof GetPermissionsListRequestQuerySchema>
export type GetPermissionsListResponseType = z.infer<typeof GetPermissionsListResponseSchema>
export type GetPermissionRequestParamsType = z.infer<typeof GetPermissionRequestParamsSchema>
export type PermissionDetailsType = z.infer<typeof PermissionDetailsSchema>
export type CreatePermissionRequestBodyType = z.infer<typeof CreatePermissionRequestBodySchema>
export type UpdatePermissionRequestBodyType = z.infer<typeof UpdatePermissionRequestBodySchema>
