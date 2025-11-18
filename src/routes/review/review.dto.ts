import { createZodDto } from 'nestjs-zod'
import {
  CreateReviewRequestBodySchema,
  CreateReviewResponseSchema,
  GetPaginatedReviewsListByProductRequestParamsSchema,
  GetPaginatedReviewsListRequestQuerySchema,
  GetPaginatedReviewsListResponseSchema,
  GetReviewDetailsResponseSchema,
  GetReviewRequestParamsSchema,
  UpdateReviewRequestBodySchema,
  UpdateReviewResponseSchema,
} from 'src/routes/review/review.model'

export class GetPaginatedReviewsListRequestParamsDTO extends createZodDto(
  GetPaginatedReviewsListByProductRequestParamsSchema,
) {}
export class GetPaginatedReviewsListRequestQueryDTO extends createZodDto(GetPaginatedReviewsListRequestQuerySchema) {}
export class GetPaginatedReviewsListResponseDTO extends createZodDto(GetPaginatedReviewsListResponseSchema) {}
export class GetReviewRequestParamsDTO extends createZodDto(GetReviewRequestParamsSchema) {}
export class GetReviewDetailsResponseDTO extends createZodDto(GetReviewDetailsResponseSchema) {}
export class CreateReviewRequestBodyDTO extends createZodDto(CreateReviewRequestBodySchema) {}
export class CreateReviewResponseDTO extends createZodDto(CreateReviewResponseSchema) {}
export class UpdateReviewRequestBodyDTO extends createZodDto(UpdateReviewRequestBodySchema) {}
export class UpdateReviewResponseDTO extends createZodDto(UpdateReviewResponseSchema) {}
