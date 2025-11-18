import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateReviewRequestBodyDTO,
  CreateReviewResponseDTO,
  GetPaginatedReviewsListRequestParamsDTO,
  GetPaginatedReviewsListRequestQueryDTO,
  GetPaginatedReviewsListResponseDTO,
  GetReviewRequestParamsDTO,
  UpdateReviewRequestBodyDTO,
  UpdateReviewResponseDTO,
} from 'src/routes/review/review.dto'
import { ReviewService } from 'src/routes/review/review.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @IsPublic()
  @Get('/products/:productId')
  @ZodResponse({ type: GetPaginatedReviewsListResponseDTO })
  getPaginatedList(
    @Param() params: GetPaginatedReviewsListRequestParamsDTO,
    @Query() query: GetPaginatedReviewsListRequestQueryDTO,
  ) {
    return this.reviewService.getPaginatedList(params.productId, query)
  }

  @Post()
  @ZodResponse({ type: CreateReviewResponseDTO })
  create(@Body() body: CreateReviewRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.reviewService.create(userId, body)
  }

  @Put(':id')
  @ZodResponse({ type: UpdateReviewResponseDTO })
  update(
    @Param() params: GetReviewRequestParamsDTO,
    @Body() body: UpdateReviewRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.reviewService.update({
      userId,
      reviewId: params.id,
      payload: body,
    })
  }
}
