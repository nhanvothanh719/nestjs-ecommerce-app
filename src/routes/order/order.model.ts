import { OrderStatus } from 'src/shared/constants/order.constant'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import * as z from 'zod'

const OrderStatusSchema = z.enum([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PENDING_PICKUP,
  OrderStatus.PENDING_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.RETURNED,
  OrderStatus.CANCELLED,
])

export const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  status: OrderStatusSchema,
  receiver: z.object({
    name: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
  }),
  shopId: z.number().nullable(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ProductSKUSnapshotSchema = z.object({
  id: z.number(),
  productId: z.number().nullable(),
  productName: z.string(),
  productTranslations: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      languageId: z.string(),
    }),
  ),
  skuPrice: z.number(),
  skuImage: z.string(),
  skuId: z.number().nullable(),
  skuValue: z.string(),
  orderId: z.number().nullable(),
  quantity: z.number(),
  createdAt: z.date(),
})

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

export const CancelOrderResponseSchema = OrderSchema

export type OrderType = z.infer<typeof OrderSchema>
export type GetPaginatedOrdersListRequestQueryType = z.infer<typeof GetPaginatedOrdersListRequestQuerySchema>
export type GetPaginatedOrdersListResponseType = z.infer<typeof GetPaginatedOrdersListResponseSchema>
export type GetOrderRequestParamsType = z.infer<typeof GetOrderRequestParamsSchema>
export type GetOrderDetailsResponseType = z.infer<typeof GetOrderDetailsResponseSchema>
export type CreateOrderRequestBodyType = z.infer<typeof CreateOrderRequestBodySchema>
export type CreateOrderResponseType = z.infer<typeof CreateOrderResponseSchema>
export type CancelOrderResponseType = z.infer<typeof CancelOrderResponseSchema>
