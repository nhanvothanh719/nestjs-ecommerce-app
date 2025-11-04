import { ProductTranslationSchema } from 'src/shared/models/product-translation.model'
import { ProductSchema } from 'src/shared/models/product.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { SKUSchema } from 'src/shared/models/sku.model'
import { UserSchema } from 'src/shared/models/user.model'
import * as z from 'zod'

export const CartItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
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

export const GroupedCartItemsSchema = z.object({
  shop: UserSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SKUSchema.extend({
        product: ProductSchema.extend({
          productTranslations: z.array(
            ProductTranslationSchema.omit({
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
              updatedByUserId: true,
            }),
          ),
        }).omit({
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          updatedByUserId: true,
        }),
      }).omit({
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        updatedByUserId: true,
      }),
    }).omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
})

export const GetPaginatedCartItemsRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetPaginatedCartItemsResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(GroupedCartItemsSchema),
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
export type GroupedCartItemsType = z.infer<typeof GroupedCartItemsSchema>
export type GetPaginatedCartItemsRequestQueryType = z.infer<typeof GetPaginatedCartItemsRequestQuerySchema>
export type GetPaginatedCartItemsResponseType = z.infer<typeof GetPaginatedCartItemsResponseSchema>
export type AddToCartRequestBodyType = z.infer<typeof AddToCartRequestBodySchema>
export type UpdateCartItemRequestBodyType = z.infer<typeof UpdateCartItemRequestBodySchema>
export type DeleteCartItemsRequestBodyType = z.infer<typeof DeleteCartItemsRequestBodySchema>
