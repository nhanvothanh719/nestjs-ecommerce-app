import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateReviewRequestBodyType,
  CreateReviewResponseType,
  GetPaginatedReviewsListRequestQueryType,
  GetPaginatedReviewsListResponseType,
  UpdateReviewRequestBodyType,
  UpdateReviewResponseType,
} from 'src/routes/review/review.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { OrderType } from 'src/shared/models/order.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList(
    productId: number,
    paginationData: GetPaginatedReviewsListRequestQueryType,
  ): Promise<GetPaginatedReviewsListResponseType> {
    const { limit, page } = paginationData
    const skip = (page - 1) * limit

    const [totalItems, data] = await Promise.all([
      this.prismaService.review.count({
        where: {
          productId,
        },
      }),
      this.prismaService.review.findMany({
        where: {
          productId,
        },
        skip,
        take: limit,
        include: {
          medias: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])
    const totalPages = Math.ceil(totalItems / limit)

    return { limit, page, data, totalItems, totalPages }
  }

  async create(userId: number, payload: CreateReviewRequestBodyType): Promise<CreateReviewResponseType> {
    const { orderId, productId, content, rating, medias } = payload
    await this.findAndValidateOrder(orderId, userId)

    return this.prismaService.$transaction(async (tx) => {
      const review = await this.prismaService.review.create({
        data: {
          userId,
          orderId,
          productId,
          content,
          rating,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      const reviewMedias = await this.prismaService.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          ...media,
          reviewId: review.id,
        })),
      })

      return {
        ...review,
        medias: reviewMedias,
      }
    })
  }

  async update({
    userId,
    reviewId,
    payload,
  }: {
    userId: number
    reviewId: number
    payload: UpdateReviewRequestBodyType
  }): Promise<UpdateReviewResponseType> {
    const { orderId, productId, content, rating, medias } = payload

    await Promise.all([
      this.findAndValidateOrder(orderId, userId),
      this.findAndValidateReviewUpdateAction(reviewId, userId),
    ])

    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.review.update({
        where: {
          id: reviewId,
        },
        data: {
          productId,
          content,
          orderId,
          userId,
          rating,
          updateCount: {
            increment: 1,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      })

      await tx.reviewMedia.deleteMany({
        where: {
          reviewId,
        },
      })

      const reviewMedias = await tx.reviewMedia.createManyAndReturn({
        data: medias.map((media) => ({
          url: media.url,
          type: media.type,
          reviewId: review.id,
        })),
      })

      return {
        ...review,
        medias: reviewMedias,
      }
    })
  }

  private async findAndValidateOrder(orderId: number, userId: number): Promise<OrderType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
    })

    // Không cho phép user review nếu không phải là người mua
    if (!order) throw new BadRequestException('Cannot review this product')

    // Không cho phép review nếu đơn hàng chưa được giao
    if (order.status !== OrderStatus.DELIVERED)
      throw new BadRequestException('This order is not successfully delivered')

    return order
  }

  private async findAndValidateReviewUpdateAction(reviewId: number, userId: number) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id: reviewId,
        userId,
      },
    })
    if (!review) throw new NotFoundException('Not found review')
    if (review.updateCount >= 1) throw new BadRequestException('You can update the review once.')
    return review
  }
}
