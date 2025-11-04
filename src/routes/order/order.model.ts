import { OrderSchema, OrderStatusSchema, ProductSKUSnapshotSchema } from 'src/shared/models/order.model'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

export const GetPaginatedOrdersListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema.extend({
  status: OrderStatusSchema.optional(),
}).strict()

export const GetPaginatedOrdersListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(
    OrderSchema.extend({
      items: z.array(ProductSKUSnapshotSchema),
    }).omit({
      receiver: true,
      deletedAt: true,
      createdByUserId: true,
      updatedByUserId: true,
    }),
  ),
})

export const GetOrderDetailsResponseSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
})

export const GetOrderRequestParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict()

export const CreateOrderRequestBodySchema = z
  .array(
    z.object({
      shopId: z.number(),
      receiver: z.object({
        name: z.string(),
        phoneNumber: z.string(),
        address: z.string(),
      }),
      cartItemIds: z.array(z.number()).min(1),
    }),
  )
  .min(1)

export const CreateOrderResponseSchema = z.object({
  data: z.array(OrderSchema),
})

export const CancelOrderRequestBodySchema = z.object({})

export const CancelOrderResponseSchema = OrderSchema

export type GetPaginatedOrdersListRequestQueryType = z.infer<typeof GetPaginatedOrdersListRequestQuerySchema>
export type GetPaginatedOrdersListResponseType = z.infer<typeof GetPaginatedOrdersListResponseSchema>
export type GetOrderRequestParamsType = z.infer<typeof GetOrderRequestParamsSchema>
export type GetOrderDetailsResponseType = z.infer<typeof GetOrderDetailsResponseSchema>
export type CreateOrderRequestBodyType = z.infer<typeof CreateOrderRequestBodySchema>
export type CreateOrderResponseType = z.infer<typeof CreateOrderResponseSchema>
export type CancelOrderRequestBodyType = z.infer<typeof CancelOrderRequestBodySchema>
export type CancelOrderResponseType = z.infer<typeof CancelOrderResponseSchema>
