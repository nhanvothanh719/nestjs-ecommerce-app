import { ProductTranslationSchema } from 'src/routes/product-translation/product-translation.model'
import { generateSKUs } from 'src/routes/product/product.helper'
import { SKUSchema, UpsertSKURequestBodySchema } from 'src/routes/product/sku.model'
import { BrandWithTranslationsSchema } from 'src/shared/models/brand.model'
import { CategoryWithTranslationsSchema } from 'src/shared/models/category.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

export const VariantSchema = z.object({
  value: z.string(),
  options: z.array(z.string()),
})

export const VariantsListSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  const seenVariantValuesSet = new Set<string>()
  variants.forEach((variant) => {
    // Check duplicate variant values
    if (seenVariantValuesSet.has(variant.value)) {
      ctx.addIssue({
        code: 'custom',
        message: `${variant.value} has already existed in variants list`,
        path: ['variants'],
      })
    } else {
      seenVariantValuesSet.add(variant.value)
    }

    // Check for duplicate options
    const seenVariantOptionsSet = new Set<string>()
    variant.options.forEach((option) => {
      if (seenVariantOptionsSet.has(option)) {
        ctx.addIssue({
          code: 'custom',
          message: `${variant.value} has duplicated options`,
          path: ['variants'],
        })
      } else {
        seenVariantOptionsSet.add(option)
      }
    })
  })
})

export const ProductSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(),
  name: z.string().max(500),
  basePrice: z.number().positive(),
  virtualPrice: z.number().positive(),
  brandId: z.number().positive(),
  images: z.array(z.string()),
  variants: VariantsListSchema,
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const GetPaginatedProductsListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema.extend({
  name: z.string().optional(),
  brandIds: z.array(z.coerce.number().int().positive()).optional(),
  categories: z.array(z.coerce.number().int().positive()).optional(),
  minPrice: z.coerce.number().int().positive().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
}).strict()

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
      const isCorrectSKUValue = sku.value === generateSKUs[idx].value
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

export type VariantType = z.infer<typeof VariantSchema>
export type VariantsListType = z.infer<typeof VariantsListSchema>
export type ProductType = z.infer<typeof ProductSchema>
export type GetPaginatedProductsListRequestQueryType = z.infer<typeof GetPaginatedProductsListRequestQuerySchema>
export type GetPaginatedProductsListResponseType = z.infer<typeof GetPaginatedProductsListResponseSchema>
export type GetProductRequestParamsType = z.infer<typeof GetProductRequestParamsSchema>
export type GetProductDetailsResponseType = z.infer<typeof GetProductDetailsResponseSchema>
export type CreateProductRequestBodyType = z.infer<typeof CreateProductRequestBodySchema>
export type UpdateProductRequestBodyType = z.infer<typeof UpdateProductRequestBodySchema>
