import { ProductTranslationSchema } from 'src/routes/product-translation/product-translation.model'
import { ProductSchema } from 'src/shared/models/product.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { SKUSchema } from 'src/shared/models/sku.model'
import * as z from 'zod'

export const CartItemSchema = z.object({
  id: z.number(),
  skuId: z.number(),
  quantity: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const GetCartItemRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const CartItemDetailsSchema = CartItemSchema.extend({
  sku: SKUSchema.extend({
    product: ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  }),
})

export const GetPaginatedCartItemsRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetPaginatedCartItemsResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(CartItemDetailsSchema),
})

export const AddToCartRequestBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true,
}).strict()

export const UpdateCartItemRequestBodySchema = AddToCartRequestBodySchema

export const DeleteCartItemsRequestBodySchema = z
  .object({
    ids: z.array(z.number().int().positive()),
  })
  .strict()

export type CartItemType = z.infer<typeof CartItemSchema>
export type GetCartItemRequestParamsType = z.infer<typeof GetCartItemRequestParamsSchema>
export type CartItemDetailsType = z.infer<typeof CartItemDetailsSchema>
export type GetPaginatedCartItemsRequestQueryType = z.infer<typeof GetPaginatedCartItemsRequestQuerySchema>
export type GetPaginatedCartItemsResponseType = z.infer<typeof GetPaginatedCartItemsResponseSchema>
export type AddToCartRequestBodyType = z.infer<typeof AddToCartRequestBodySchema>
export type UpdateCartItemRequestBodyType = z.infer<typeof UpdateCartItemRequestBodySchema>
export type DeleteCartItemsRequestBodyType = z.infer<typeof DeleteCartItemsRequestBodySchema>
