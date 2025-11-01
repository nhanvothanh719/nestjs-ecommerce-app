import * as z from 'zod'

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string(),
  price: z.number().positive(),
  stock: z.number().positive(),
  image: z.string(),
  productId: z.number(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const UpsertSKURequestBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
})

export type SKUType = z.infer<typeof SKUSchema>
export type UpsertSKURequestBodyType = z.infer<typeof UpsertSKURequestBodySchema>
