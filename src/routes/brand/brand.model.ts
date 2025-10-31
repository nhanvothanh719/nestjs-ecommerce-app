import { BrandTranslationSchema } from 'src/routes/brand-translation/brand-translation.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  logo: z.url(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const BrandWithTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export const GetPaginatedBrandsListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetPaginatedBrandsListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(BrandWithTranslationsSchema),
})

export const GetBrandRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetBrandDetailsResponseSchema = BrandWithTranslationsSchema

export const CreateBrandRequestBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
}).strict()

export const UpdateBrandRequestBodySchema = CreateBrandRequestBodySchema

export type BrandType = z.infer<typeof BrandSchema>
export type BrandWithTranslationsType = z.infer<typeof BrandWithTranslationsSchema>
export type GetPaginatedBrandsListRequestQueryType = z.infer<typeof GetPaginatedBrandsListRequestQuerySchema>
export type GetPaginatedBrandsListResponseType = z.infer<typeof GetPaginatedBrandsListResponseSchema>
export type GetBrandRequestParamsType = z.infer<typeof GetBrandRequestParamsSchema>
export type GetBrandDetailsResponseType = z.infer<typeof GetBrandDetailsResponseSchema>
export type CreateBrandRequestBodyType = z.infer<typeof CreateBrandRequestBodySchema>
export type UpdateBrandRequestBodyType = z.infer<typeof UpdateBrandRequestBodySchema>
