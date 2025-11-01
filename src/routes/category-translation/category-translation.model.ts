import { CategoryTranslationSchema } from 'src/shared/models/category-translation.model'
import * as z from 'zod'

export const GetCategoryTranslationRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetCategoryTranslationDetailsResponseSchema = CategoryTranslationSchema

export const CreateCategoryTranslationRequestBodySchema = CategoryTranslationSchema.pick({
  categoryId: true,
  languageId: true,
  name: true,
  description: true,
}).strict()

export const UpdateCategoryTranslationRequestBodySchema = CreateCategoryTranslationRequestBodySchema

export type GetCategoryTranslationRequestParamsType = z.infer<typeof GetCategoryTranslationRequestParamsSchema>
export type GetCategoryTranslationDetailsResponseType = z.infer<typeof GetCategoryTranslationDetailsResponseSchema>
export type CreateCategoryTranslationRequestBodyType = z.infer<typeof CreateCategoryTranslationRequestBodySchema>
export type UpdateCategoryTranslationRequestBodyType = z.infer<typeof UpdateCategoryTranslationRequestBodySchema>
