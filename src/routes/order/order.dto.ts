import { createZodDto } from 'nestjs-zod'
import {
  CancelOrderRequestBodySchema,
  CancelOrderResponseSchema,
  CreateOrderRequestBodySchema,
  CreateOrderResponseSchema,
  GetOrderDetailsResponseSchema,
  GetOrderRequestParamsSchema,
  GetPaginatedOrdersListRequestQuerySchema,
  GetPaginatedOrdersListResponseSchema,
} from 'src/routes/order/order.model'
import { OrderSchema } from 'src/shared/models/order.model'

export class OrderDTO extends createZodDto(OrderSchema) {}
export class GetPaginatedOrdersListRequestQueryDTO extends createZodDto(GetPaginatedOrdersListRequestQuerySchema) {}
export class GetPaginatedOrdersListResponseDTO extends createZodDto(GetPaginatedOrdersListResponseSchema) {}
export class GetOrderRequestParamsDTO extends createZodDto(GetOrderRequestParamsSchema) {}
export class GetOrderDetailsResponseDTO extends createZodDto(GetOrderDetailsResponseSchema) {}
export class CreateOrderRequestBodyDTO extends createZodDto(CreateOrderRequestBodySchema) {}
export class CreateOrderResponseDTO extends createZodDto(CreateOrderResponseSchema) {}
export class CancelOrderRequestBodyDTO extends createZodDto(CancelOrderRequestBodySchema) {}
export class CancelOrderResponseDTO extends createZodDto(CancelOrderResponseSchema) {}
