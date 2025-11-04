import * as z from 'zod'

export const ProductTranslationSchema = z.object({
  id: z.number(),
  productId: z.number(),
  languageId: z.string(),
  name: z.string().min(1).max(500),
  description: z.string().min(1).max(500),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>
