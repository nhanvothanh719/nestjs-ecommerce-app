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

export const GetProductTranslationRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetProductTranslationDetailsResponseSchema = ProductTranslationSchema

export const CreateProductTranslationRequestBodySchema = ProductTranslationSchema.pick({
  productId: true,
  languageId: true,
  name: true,
  description: true,
}).strict()

export const UpdateProductTranslationRequestBodySchema = ProductTranslationSchema.pick({
  productId: true,
  languageId: true,
  name: true,
  description: true,
})
  .partial()
  .strict()

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>
export type GetProductTranslationRequestParamsType = z.infer<typeof GetProductTranslationRequestParamsSchema>
export type GetProductTranslationDetailsResponseType = z.infer<typeof GetProductTranslationDetailsResponseSchema>
export type CreateProductTranslationRequestBodyType = z.infer<typeof CreateProductTranslationRequestBodySchema>
export type UpdateProductTranslationRequestBodyType = z.infer<typeof UpdateProductTranslationRequestBodySchema>
