import { Injectable } from '@nestjs/common'
import {
  BrandType,
  CreateBrandRequestBodyType,
  GetBrandDetailsResponseType,
  GetPaginatedBrandsListRequestQueryType,
  GetPaginatedBrandsListResponseType,
  UpdateBrandRequestBodyType,
} from 'src/routes/brand/brand.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList(
    paginationData: GetPaginatedBrandsListRequestQueryType,
    languageId?: string,
  ): Promise<GetPaginatedBrandsListResponseType> {
    const { limit, page } = paginationData
    const skip = (page - 1) * limit
    const $countTotalItems = this.prismaService.brand.count({
      where: { deletedAt: null },
    })
    const $getPaginatedList = this.prismaService.brand.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: {
        brandTranslations: {
          where: languageId ? { languageId, deletedAt: null } : { deletedAt: null },
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

  async findById(id: number, languageId?: string): Promise<GetBrandDetailsResponseType | null> {
    return await this.prismaService.brand.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId ? { deletedAt: null, languageId } : { deletedAt: null },
        },
      },
    })
  }

  async create({
    data,
    createdByUserId,
  }: {
    data: CreateBrandRequestBodyType
    createdByUserId: number | null
  }): Promise<GetBrandDetailsResponseType> {
    return await this.prismaService.brand.create({
      data: {
        ...data,
        createdByUserId,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  async update({
    id,
    data,
    updatedByUserId,
  }: {
    id: number
    data: UpdateBrandRequestBodyType
    updatedByUserId: number
  }): Promise<GetBrandDetailsResponseType> {
    return this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedByUserId,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  async delete({
    id,
    isHardDelete,
    updatedByUserId,
  }: {
    id: number
    isHardDelete?: boolean
    updatedByUserId: number
  }): Promise<BrandType> {
    if (isHardDelete) {
      return await this.prismaService.brand.delete({
        where: { id },
      })
    }
    return await this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        updatedByUserId,
        deletedAt: new Date(),
      },
    })
  }
}
