import { PermissionSchema } from 'src/shared/models/permission.model'
import * as z from 'zod'

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
})

export type RoleType = z.infer<typeof RoleSchema>
export type RoleWithPermissionsType = z.infer<typeof RoleWithPermissionsSchema>
