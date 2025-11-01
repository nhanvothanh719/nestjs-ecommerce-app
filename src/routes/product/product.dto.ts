import { createZodDto } from 'nestjs-zod'
import {
  CreateProductRequestBodySchema,
  GetPaginatedProductsListRequestQuerySchema,
  GetPaginatedProductsListResponseSchema,
  GetProductDetailsResponseSchema,
  GetProductRequestParamsSchema,
  UpdateProductRequestBodySchema,
} from 'src/routes/product/product.model'

export class GetPaginatedProductsListRequestQueryDTO extends createZodDto(GetPaginatedProductsListRequestQuerySchema) {}
export class GetPaginatedProductsListResponseDTO extends createZodDto(GetPaginatedProductsListResponseSchema) {}
export class GetProductRequestParamsDTO extends createZodDto(GetProductRequestParamsSchema) {}
export class GetProductDetailsResponseDTO extends createZodDto(GetProductDetailsResponseSchema) {}
export class CreateProductRequestBodyDTO extends createZodDto(CreateProductRequestBodySchema) {}
export class UpdateProductRequestBodyDTO extends createZodDto(UpdateProductRequestBodySchema) {}
