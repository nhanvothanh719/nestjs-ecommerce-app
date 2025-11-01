import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryRequestBodySchema,
  GetCategoriesListRequestQuerySchema,
  GetCategoriesListResponseSchema,
  GetCategoryDetailsResponseSchema,
  GetCategoryRequestParamsSchema,
  UpdateCategoryRequestBodySchema,
} from 'src/routes/category/category.model'

export class GetCategoriesListRequestQueryDTO extends createZodDto(GetCategoriesListRequestQuerySchema) {}
export class GetCategoriesListResponseDTO extends createZodDto(GetCategoriesListResponseSchema) {}
export class GetCategoryRequestParamsDTO extends createZodDto(GetCategoryRequestParamsSchema) {}
export class GetCategoryDetailsResponseDTO extends createZodDto(GetCategoryDetailsResponseSchema) {}
export class CreateCategoryRequestBodyDTO extends createZodDto(CreateCategoryRequestBodySchema) {}
export class UpdateCategoryRequestBodyDTO extends createZodDto(UpdateCategoryRequestBodySchema) {}
