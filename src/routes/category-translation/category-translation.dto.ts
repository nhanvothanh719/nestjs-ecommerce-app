import { createZodDto } from 'nestjs-zod'
import {
  CategoryTranslationSchema,
  CreateCategoryTranslationRequestBodySchema,
  GetCategoryTranslationDetailsResponseSchema,
  GetCategoryTranslationRequestParamsSchema,
  UpdateCategoryTranslationRequestBodySchema,
} from 'src/routes/category-translation/category-translation.model'

export class CategoryTranslationDTO extends createZodDto(CategoryTranslationSchema) {}
export class GetCategoryTranslationRequestParamsDTO extends createZodDto(GetCategoryTranslationRequestParamsSchema) {}
export class GetCategoryTranslationDetailsResponseDTO extends createZodDto(
  GetCategoryTranslationDetailsResponseSchema,
) {}
export class CreateCategoryTranslationRequestBodyDTO extends createZodDto(CreateCategoryTranslationRequestBodySchema) {}
export class UpdateCategoryTranslationRequestBodyDTO extends createZodDto(UpdateCategoryTranslationRequestBodySchema) {}
