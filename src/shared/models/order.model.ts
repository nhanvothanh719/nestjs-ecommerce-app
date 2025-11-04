import { OrderStatus } from 'src/shared/constants/order.constant'
import * as z from 'zod'

export const OrderStatusSchema = z.enum([
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
  paymentId: z.number(),
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
  skuPrice: z.number().positive(),
  skuImage: z.string(),
  skuId: z.number().nullable(),
  skuValue: z.string(),
  orderId: z.number().nullable(),
  quantity: z.number().int().positive(),
  createdAt: z.date(),
})

export const OrderWithProductSKUSnapshotsSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
})

export type OrderType = z.infer<typeof OrderSchema>
export type OrderWithProductSKUSnapshotsType = z.infer<typeof OrderWithProductSKUSnapshotsSchema>
