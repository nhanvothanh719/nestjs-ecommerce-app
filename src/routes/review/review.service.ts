import { Injectable } from '@nestjs/common'
import {
  CreateReviewRequestBodyType,
  GetPaginatedReviewsListRequestQueryType,
  GetPaginatedReviewsListResponseType,
  UpdateReviewRequestBodyType,
} from 'src/routes/review/review.model'
import { ReviewRepository } from 'src/routes/review/review.repo'

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  getPaginatedList(
    productId: number,
    paginationData: GetPaginatedReviewsListRequestQueryType,
  ): Promise<GetPaginatedReviewsListResponseType> {
    return this.reviewRepository.getPaginatedList(productId, paginationData)
  }

  create(userId: number, payload: CreateReviewRequestBodyType) {
    return this.reviewRepository.create(userId, payload)
  }

  update(data: { userId: number; reviewId: number; payload: UpdateReviewRequestBodyType }) {
    return this.reviewRepository.update(data)
  }
}
