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

export type RoleType = z.infer<typeof RoleSchema>
