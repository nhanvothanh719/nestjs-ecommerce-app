import { createZodDto } from 'nestjs-zod'
import {
  AddToCartRequestBodySchema,
  CartItemDetailsSchema,
  CartItemSchema,
  DeleteCartItemsRequestBodySchema,
  GetCartItemRequestParamsSchema,
  GetPaginatedCartItemsRequestQuerySchema,
  GetPaginatedCartItemsResponseSchema,
  UpdateCartItemRequestBodySchema,
} from 'src/routes/cart/cart.model'

export class CartItemDTO extends createZodDto(CartItemSchema) {}
export class GetCartItemRequestParamsDTO extends createZodDto(GetCartItemRequestParamsSchema) {}
export class CartItemDetailsDTO extends createZodDto(CartItemDetailsSchema) {}
export class GetPaginatedCartItemsRequestQueryDTO extends createZodDto(GetPaginatedCartItemsRequestQuerySchema) {}
export class GetPaginatedCartItemsResponseDTO extends createZodDto(GetPaginatedCartItemsResponseSchema) {}
export class AddToCartRequestBodyDTO extends createZodDto(AddToCartRequestBodySchema) {}
export class UpdateCartItemRequestBodyDTO extends createZodDto(UpdateCartItemRequestBodySchema) {}
export class DeleteCartItemsRequestBodyDTO extends createZodDto(DeleteCartItemsRequestBodySchema) {}
