import { Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import {
  GetPaginatedOrdersListRequestQueryType,
  GetPaginatedOrdersListResponseType,
} from 'src/routes/order/order.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList(
    userId: number,
    query: GetPaginatedOrdersListRequestQueryType,
  ): Promise<GetPaginatedOrdersListResponseType> {
    const { limit, page, status } = query
    const skip = (page - 1) * limit
    const whereCondition: Prisma.OrderWhereInput = {
      userId,
      status,
    }
    const $totalOrders = this.prismaService.order.count({ where: whereCondition })
    const $ordersList = this.prismaService.order.findMany({
      where: whereCondition,
      include: {
        items: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const [totalItems, data] = await Promise.all([$totalOrders, $ordersList])
    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalItems,
      data,
      page,
      limit,
      totalPages,
    }
  }
}
