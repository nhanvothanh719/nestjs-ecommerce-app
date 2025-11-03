import { ProductTranslationSchema } from 'src/shared/models/product-translation.model'
import * as z from 'zod'

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

export type GetProductTranslationRequestParamsType = z.infer<typeof GetProductTranslationRequestParamsSchema>
export type GetProductTranslationDetailsResponseType = z.infer<typeof GetProductTranslationDetailsResponseSchema>
export type CreateProductTranslationRequestBodyType = z.infer<typeof CreateProductTranslationRequestBodySchema>
export type UpdateProductTranslationRequestBodyType = z.infer<typeof UpdateProductTranslationRequestBodySchema>
