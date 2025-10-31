import * as z from 'zod'

export const BrandTranslationSchema = z.object({
  id: z.number(),
  brandId: z.number(),
  languageId: z.string(),
  name: z.string().max(500),
  description: z.string(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

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

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>
export type GetBrandTranslationDetailsResponseType = z.infer<typeof GetBrandTranslationDetailsResponseSchema>
export type CreateBrandTranslationRequestBodyType = z.infer<typeof CreateBrandTranslationRequestBodySchema>
export type UpdateBrandTranslationRequestBodyType = z.infer<typeof UpdateBrandTranslationRequestBodySchema>
