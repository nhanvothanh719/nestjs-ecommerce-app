import { createZodDto } from 'nestjs-zod'
import {
  CancelOrderResponseSchema,
  CreateOrderRequestBodySchema,
  CreateOrderResponseSchema,
  GetOrderDetailsResponseSchema,
  GetOrderRequestParamsSchema,
  GetPaginatedOrdersListRequestQuerySchema,
  GetPaginatedOrdersListResponseSchema,
  OrderSchema,
} from 'src/routes/order/order.model'

export class OrderDTO extends createZodDto(OrderSchema) {}
export class GetPaginatedOrdersListRequestQueryDTO extends createZodDto(GetPaginatedOrdersListRequestQuerySchema) {}
export class GetPaginatedOrdersListResponseDTO extends createZodDto(GetPaginatedOrdersListResponseSchema) {}
export class GetOrderRequestParamsDTO extends createZodDto(GetOrderRequestParamsSchema) {}
export class GetOrderDetailsResponseDTO extends createZodDto(GetOrderDetailsResponseSchema) {}
export class CreateOrderRequestBodyDTO extends createZodDto(CreateOrderRequestBodySchema) {}
export class CreateOrderResponseDTO extends createZodDto(CreateOrderResponseSchema) {}
export class CancelOrderResponseDTO extends createZodDto(CancelOrderResponseSchema) {}
