import { BrandTranslationSchema } from 'src/shared/models/brand-translation.model'
import * as z from 'zod'

export const GetBrandTranslationRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetBrandTranslationDetailsResponseSchema = BrandTranslationSchema

export const CreateBrandTranslationRequestBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
}).strict()

export const UpdateBrandTranslationRequestBodySchema = CreateBrandTranslationRequestBodySchema

export type GetBrandTranslationDetailsResponseType = z.infer<typeof GetBrandTranslationDetailsResponseSchema>
export type CreateBrandTranslationRequestBodyType = z.infer<typeof CreateBrandTranslationRequestBodySchema>
export type UpdateBrandTranslationRequestBodyType = z.infer<typeof UpdateBrandTranslationRequestBodySchema>
