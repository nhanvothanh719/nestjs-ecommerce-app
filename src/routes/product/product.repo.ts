import { Injectable } from '@nestjs/common'
import {
  GetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
} from 'src/routes/product/product.model'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/lang.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList(
    query: GetPaginatedProductsListRequestQueryType,
    languageId: string,
  ): Promise<GetPaginatedProductsListResponseType> {
    const { page, limit } = query
    const skip = (page - 1) * limit
    const $countTotalItems = this.prismaService.product.count({
      where: { deletedAt: null },
    })
    const $getPaginatedList = this.prismaService.product.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: {
        productTranslations: {
          where:
            languageId === ALL_LANGUAGE_CODE
              ? {
                  deletedAt: null,
                }
              : {
                  deletedAt: null,
                  languageId,
                },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    const [totalItems, data] = await Promise.all([$countTotalItems, $getPaginatedList])
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, limit, page, totalPages }
  }
}
