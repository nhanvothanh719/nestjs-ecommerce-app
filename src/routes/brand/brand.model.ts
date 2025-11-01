import { BrandSchema, BrandWithTranslationsSchema } from 'src/shared/models/brand.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

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

export const UpdateBrandRequestBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
})
  .partial()
  .strict()

export type GetPaginatedBrandsListRequestQueryType = z.infer<typeof GetPaginatedBrandsListRequestQuerySchema>
export type GetPaginatedBrandsListResponseType = z.infer<typeof GetPaginatedBrandsListResponseSchema>
export type GetBrandRequestParamsType = z.infer<typeof GetBrandRequestParamsSchema>
export type GetBrandDetailsResponseType = z.infer<typeof GetBrandDetailsResponseSchema>
export type CreateBrandRequestBodyType = z.infer<typeof CreateBrandRequestBodySchema>
export type UpdateBrandRequestBodyType = z.infer<typeof UpdateBrandRequestBodySchema>
