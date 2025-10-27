import { createZodDto } from 'nestjs-zod'
import {
  CreateLanguageRequestBodySchema,
  GetLanguageRequestParamsSchema,
  GetLanguagesListResponseSchema,
  LanguageDetailsSchema,
  UpdateLanguageRequestBodySchema,
} from 'src/routes/language/language.model'

export class GetLanguagesListResponseDTO extends createZodDto(GetLanguagesListResponseSchema) {}
export class GetLanguageRequestParamsDTO extends createZodDto(GetLanguageRequestParamsSchema) {}
export class LanguageDetailsDTO extends createZodDto(LanguageDetailsSchema) {}
export class CreateLanguageRequestBodyDTO extends createZodDto(CreateLanguageRequestBodySchema) {}
export class UpdateLanguageRequestBodyDTO extends createZodDto(UpdateLanguageRequestBodySchema) {}
