import * as z from 'zod'

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string(),
  price: z.number().positive(),
  stock: z.number().positive(),
  image: z.string(),
  productId: z.number(),
  createdByUserId: z.number(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type SKUType = z.infer<typeof SKUSchema>
