import { MediaType } from 'src/shared/constants/media.constant'
import {
  BasePaginatedItemsListResponseSchema,
  GetPaginatedItemsListRequestQuerySchema,
} from 'src/shared/models/request.model'
import { UserSchema } from 'src/shared/models/user.model'
import z from 'zod'

export const ReviewMediaSchema = z.object({
  id: z.number().int(),
  url: z.string().max(2000),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  reviewId: z.number().int(),
  createdAt: z.date(),
})

export const ReviewSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  rating: z.number().int().min(0).max(5),
  orderId: z.number().int(),
  productId: z.number().int(),
  userId: z.number().int(),
  updateCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const GetReviewRequestParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const GetReviewDetailsResponseSchema = ReviewSchema.extend({
  medias: z.array(ReviewMediaSchema),
  user: UserSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
})

export const GetPaginatedReviewsListByProductRequestParamsSchema = z.object({
  productId: z.coerce.number().int().positive(),
})

export const GetPaginatedReviewsListRequestQuerySchema = GetPaginatedItemsListRequestQuerySchema

export const GetPaginatedReviewsListResponseSchema = BasePaginatedItemsListResponseSchema.extend({
  data: z.array(GetReviewDetailsResponseSchema),
})

export const CreateReviewRequestBodySchema = ReviewSchema.pick({
  content: true,
  rating: true,
  productId: true,
  orderId: true,
}).extend({
  medias: z.array(
    ReviewMediaSchema.pick({
      url: true,
      type: true,
    }),
  ),
})

export const CreateReviewResponseSchema = GetReviewDetailsResponseSchema

export const UpdateReviewRequestBodySchema = CreateReviewRequestBodySchema

export const UpdateReviewResponseSchema = CreateReviewResponseSchema

export type ReviewType = z.infer<typeof ReviewSchema>
export type ReviewMediaType = z.infer<typeof ReviewMediaSchema>
export type GetPaginatedReviewsListByProductRequestParamsType = z.infer<
  typeof GetPaginatedReviewsListByProductRequestParamsSchema
>
export type GetPaginatedReviewsListRequestQueryType = z.infer<typeof GetPaginatedReviewsListRequestQuerySchema>
export type GetPaginatedReviewsListResponseType = z.infer<typeof GetPaginatedReviewsListResponseSchema>
export type GetReviewRequestParamsType = z.infer<typeof GetReviewRequestParamsSchema>
export type GetReviewDetailsResponseType = z.infer<typeof GetReviewDetailsResponseSchema>
export type CreateReviewRequestBodyType = z.infer<typeof CreateReviewRequestBodySchema>
export type CreateReviewResponseType = z.infer<typeof CreateReviewResponseSchema>
export type UpdateReviewRequestBodyType = z.infer<typeof UpdateReviewRequestBodySchema>
export type UpdateReviewResponseType = z.infer<typeof UpdateReviewResponseSchema>
