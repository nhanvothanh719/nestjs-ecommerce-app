import * as z from 'zod'

export const CategoryTranslationSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  languageId: z.string(),
  name: z.string().max(500),
  description: z.string(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

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
})

export const UpdateCategoryTranslationRequestBodySchema = CreateCategoryTranslationRequestBodySchema

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>
export type GetCategoryTranslationRequestParamsType = z.infer<typeof GetCategoryTranslationRequestParamsSchema>
export type GetCategoryTranslationDetailsResponseType = z.infer<typeof GetCategoryTranslationDetailsResponseSchema>
export type CreateCategoryTranslationRequestBodyType = z.infer<typeof CreateCategoryTranslationRequestBodySchema>
export type UpdateCategoryTranslationRequestBodyType = z.infer<typeof UpdateCategoryTranslationRequestBodySchema>
