import { createZodDto } from 'nestjs-zod'
import {
  CreateProductTranslationRequestBodySchema,
  GetProductTranslationDetailsResponseSchema,
  GetProductTranslationRequestParamsSchema,
  UpdateProductTranslationRequestBodySchema,
} from 'src/routes/product-translation/product-translation.model'
import { ProductTranslationSchema } from 'src/shared/models/product-translation.model'

export class ProductTranslationDTO extends createZodDto(ProductTranslationSchema) {}
export class GetProductTranslationRequestParamsDTO extends createZodDto(GetProductTranslationRequestParamsSchema) {}
export class GetProductTranslationDetailsResponseDTO extends createZodDto(GetProductTranslationDetailsResponseSchema) {}
export class CreateProductTranslationRequestBodyDTO extends createZodDto(CreateProductTranslationRequestBodySchema) {}
export class UpdateProductTranslationRequestBodyDTO extends createZodDto(UpdateProductTranslationRequestBodySchema) {}
