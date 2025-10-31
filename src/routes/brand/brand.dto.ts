import { createZodDto } from 'nestjs-zod'
import {
  BrandSchema,
  BrandWithTranslationsSchema,
  CreateBrandRequestBodySchema,
  GetBrandDetailsResponseSchema,
  GetBrandRequestParamsSchema,
  GetPaginatedBrandsListRequestQuerySchema,
  GetPaginatedBrandsListResponseSchema,
  UpdateBrandRequestBodySchema,
} from 'src/routes/brand/brand.model'

export class BrandDTO extends createZodDto(BrandSchema) {}
export class BrandWithTranslationsDTO extends createZodDto(BrandWithTranslationsSchema) {}
export class GetPaginatedBrandsListRequestQueryDTO extends createZodDto(GetPaginatedBrandsListRequestQuerySchema) {}
export class GetPaginatedBrandsListResponseDTO extends createZodDto(GetPaginatedBrandsListResponseSchema) {}
export class GetBrandRequestParamsDTO extends createZodDto(GetBrandRequestParamsSchema) {}
export class GetBrandDetailsResponseDTO extends createZodDto(GetBrandDetailsResponseSchema) {}
export class CreateBrandRequestBodyDTO extends createZodDto(CreateBrandRequestBodySchema) {}
export class UpdateBrandRequestBodyDTO extends createZodDto(UpdateBrandRequestBodySchema) {}