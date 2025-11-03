import { generateSKUs } from 'src/routes/product/product.helper'
import { UpsertSKURequestBodySchema } from 'src/routes/product/sku.model'
import { ProductSortField, OrderBy } from 'src/shared/constants/others.constants'
import { BrandWithTranslationsSchema } from 'src/shared/models/brand.model'
import { CategoryWithTranslationsSchema } from 'src/shared/models/category.model'
import { ProductTranslationSchema } from 'src/shared/models/product-translation.model'
import { ProductSchema } from 'src/shared/models/product.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { SKUSchema } from 'src/shared/models/sku.model'
import * as z from 'zod'

// Dành cho client và guest
export const GetPaginatedProductsListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema.extend({
  name: z.string().optional(),
  brandIds: z
    .preprocess((value) => {
      // Ex: ?brandIds=1
      if (typeof value === 'string') {
        return [Number(value)]
      }
      // Ex: ?brandIds=1&brandIds=2...
      return value
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  categories: z
    .preprocess((value) => {
      // Ex: ?categories=1
      if (typeof value === 'string') {
        return [Number(value)]
      }
      // Ex: ?categories=1&categories=2...
      return value
    }, z.array(z.coerce.number().int().positive()))
    .optional(),
  minPrice: z.coerce.number().int().positive().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  createdByUserId: z.coerce.number().int().positive().optional(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Asc),
  sortedBy: z
    .enum([ProductSortField.CreatedAt, ProductSortField.Price, ProductSortField.Sale])
    .default(ProductSortField.CreatedAt),
}).strict()

// Dành cho admin và seller
export const ForManagementGetPaginatedProductsListRequestQuerySchema =
  GetPaginatedProductsListRequestQuerySchema.extend({
    isPublic: z.preprocess((value) => {
      if (value === undefined || value === '') return undefined
      if (value === '1' || value === 'true') return true
      if (value === '0' || value === 'false') return false
      return undefined
    }, z.boolean().optional()),
    createdByUserId: z.coerce.number().int().positive(), // Required!
  })

export const GetPaginatedProductsListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(
    ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  ),
})

export const GetProductRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const GetProductDetailsResponseSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryWithTranslationsSchema),
  brand: BrandWithTranslationsSchema,
})

export const CreateProductRequestBodySchema = ProductSchema.pick({
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
  publishedAt: true,
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKURequestBodySchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const generatedSKUs = generateSKUs(variants)

    if (skus.length !== generatedSKUs.length) {
      ctx.addIssue({
        code: 'custom',
        message: `Incorrect SKUs length`,
        path: ['skus'],
      })
    }

    let incorrectIndex = -1
    const isCorrectSKUsList = skus.every((sku, idx) => {
      const isCorrectSKUValue = sku.value === generatedSKUs[idx].value
      if (!isCorrectSKUValue) {
        incorrectIndex = idx
        return false
      }
      return isCorrectSKUValue
    })

    if (!isCorrectSKUsList) {
      ctx.addIssue({
        code: 'custom',
        message: `Incorrect SKU item at index: ${incorrectIndex}`,
        path: ['skus'],
      })
    }
  })

export const UpdateProductRequestBodySchema = CreateProductRequestBodySchema

export type GetPaginatedProductsListRequestQueryType = z.infer<typeof GetPaginatedProductsListRequestQuerySchema>
export type ForManagementGetPaginatedProductsListRequestQueryType = z.infer<
  typeof ForManagementGetPaginatedProductsListRequestQuerySchema
>
export type GetPaginatedProductsListResponseType = z.infer<typeof GetPaginatedProductsListResponseSchema>
export type GetProductRequestParamsType = z.infer<typeof GetProductRequestParamsSchema>
export type GetProductDetailsResponseType = z.infer<typeof GetProductDetailsResponseSchema>
export type CreateProductRequestBodyType = z.infer<typeof CreateProductRequestBodySchema>
export type UpdateProductRequestBodyType = z.infer<typeof UpdateProductRequestBodySchema>
