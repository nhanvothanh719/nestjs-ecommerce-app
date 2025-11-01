import { CategorySchema, CategoryWithTranslationsSchema } from 'src/shared/models/category.model'
import * as z from 'zod'

export const GetCategoriesListRequestQuerySchema = z.object({
  parentCategoryId: z.coerce.number().int().positive().optional(),
})

export const GetCategoriesListResponseSchema = z.object({
  data: z.array(CategoryWithTranslationsSchema),
  totalItems: z.number(),
})

export const GetCategoryRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetCategoryDetailsResponseSchema = CategoryWithTranslationsSchema

export const CreateCategoryRequestBodySchema = CategorySchema.pick({
  name: true,
  logo: true,
  parentCategoryId: true,
}).strict()

export const UpdateCategoryRequestBodySchema = CreateCategoryRequestBodySchema

export type GetCategoriesListRequestQueryType = z.infer<typeof GetCategoriesListRequestQuerySchema>
export type GetCategoriesListResponseType = z.infer<typeof GetCategoriesListResponseSchema>
export type GetCategoryRequestParamsType = z.infer<typeof GetCategoryRequestParamsSchema>
export type GetCategoryDetailsResponseType = z.infer<typeof GetCategoryDetailsResponseSchema>
export type CreateCategoryRequestBodyType = z.infer<typeof CreateCategoryRequestBodySchema>
export type UpdateCategoryRequestBodyType = z.infer<typeof UpdateCategoryRequestBodySchema>
