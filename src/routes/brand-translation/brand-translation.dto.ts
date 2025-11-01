import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandTranslationRequestBodySchema,
  GetBrandTranslationDetailsResponseSchema,
  GetBrandTranslationRequestParamsSchema,
  UpdateBrandTranslationRequestBodySchema,
} from 'src/routes/brand-translation/brand-translation.model'

export class GetBrandTranslationRequestParamsDTO extends createZodDto(GetBrandTranslationRequestParamsSchema) {}
export class GetBrandTranslationDetailsResponseDTO extends createZodDto(GetBrandTranslationDetailsResponseSchema) {}
export class CreateBrandTranslationRequestBodyDTO extends createZodDto(CreateBrandTranslationRequestBodySchema) {}
export class UpdateBrandTranslationRequestBodyDTO extends createZodDto(UpdateBrandTranslationRequestBodySchema) {}
