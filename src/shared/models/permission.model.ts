import { HTTPMethod } from 'src/shared/constants/permission.constant'
import * as z from 'zod'

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
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

export type PermissionType = z.infer<typeof PermissionSchema>
