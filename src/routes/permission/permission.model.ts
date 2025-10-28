import { HTTPMethod } from 'src/shared/constants/permission.constant'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  description: z.string().nullable(),
  path: z.string().max(100),
  method: z.enum([
    HTTPMethod.GET,
    HTTPMethod.POST,
    HTTPMethod.PUT,
    HTTPMethod.PATCH,
    HTTPMethod.DELETE,
    HTTPMethod.HEAD,
    HTTPMethod.OPTIONS,
  ]),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

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
  description: true,
})

export const UpdatePermissionRequestBodySchema = CreatePermissionRequestBodySchema

export type PermissionType = z.infer<typeof PermissionSchema>
export type GetPermissionsListRequestQueryType = z.infer<typeof GetPermissionsListRequestQuerySchema>
export type GetPermissionsListResponseType = z.infer<typeof GetPermissionsListResponseSchema>
export type GetPermissionRequestParamsType = z.infer<typeof GetPermissionRequestParamsSchema>
export type PermissionDetailsType = z.infer<typeof PermissionDetailsSchema>
export type CreatePermissionRequestBodyType = z.infer<typeof CreatePermissionRequestBodySchema>
export type UpdatePermissionRequestBodyType = z.infer<typeof UpdatePermissionRequestBodySchema>
