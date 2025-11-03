import { createZodDto } from 'nestjs-zod'
import {
  CreateProductRequestBodySchema,
  ForManagementGetPaginatedProductsListRequestQuerySchema,
  GetPaginatedProductsListRequestQuerySchema,
  GetPaginatedProductsListResponseSchema,
  GetProductDetailsResponseSchema,
  GetProductRequestParamsSchema,
  UpdateProductRequestBodySchema,
} from 'src/routes/product/product.model'
import { ProductSchema } from 'src/shared/models/product.model'

export class ProductDTO extends createZodDto(ProductSchema) {}
export class GetPaginatedProductsListRequestQueryDTO extends createZodDto(GetPaginatedProductsListRequestQuerySchema) {}
export class ForManagementGetPaginatedProductsListRequestQueryDTO extends createZodDto(
  ForManagementGetPaginatedProductsListRequestQuerySchema,
) {}
export class GetPaginatedProductsListResponseDTO extends createZodDto(GetPaginatedProductsListResponseSchema) {}
export class GetProductRequestParamsDTO extends createZodDto(GetProductRequestParamsSchema) {}
export class GetProductDetailsResponseDTO extends createZodDto(GetProductDetailsResponseSchema) {}
export class CreateProductRequestBodyDTO extends createZodDto(CreateProductRequestBodySchema) {}
export class UpdateProductRequestBodyDTO extends createZodDto(UpdateProductRequestBodySchema) {}
