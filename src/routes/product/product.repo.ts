import { Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import {
  CreateProductRequestBodyType,
  GetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
  GetProductDetailsResponseType,
  ProductType,
  UpdateProductRequestBodyType,
} from 'src/routes/product/product.model'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/lang.constant'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { OrderByType, ProductSortField, ProductSortFieldType } from 'src/shared/constants/others.constants'
import { PrismaService } from 'src/shared/services/prisma.service'

interface IGetProductsList {
  limit: number
  page: number
  name?: string
  brandIds?: number[]
  categories?: number[]
  minPrice?: number
  maxPrice?: number
  createdByUserId?: number
  isPublic?: boolean
  orderBy: OrderByType
  sortedBy: ProductSortFieldType
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList(
    {
      limit,
      page,
      name,
      brandIds,
      categories,
      minPrice,
      maxPrice,
      createdByUserId,
      isPublic,
      orderBy,
      sortedBy,
    }: IGetProductsList,
    languageId: string,
  ): Promise<GetPaginatedProductsListResponseType> {
    const skip = (page - 1) * limit

    let whereCondition: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdByUserId: createdByUserId ?? undefined,
    }

    const now = new Date()
    if (isPublic === true) {
      // isPublic === true -> Display published product
      // product.publicAt !== null && product.publicAt <= now
      whereCondition.publishedAt = {
        not: null,
        lte: now,
      }
    } else if (isPublic === false) {
      // isPublic === false -> Display unpublished product
      // product.publicAt === null || product.publicAt > now
      whereCondition = {
        ...whereCondition,
        OR: [{ publishedAt: null }, { publishedAt: { gt: now } }],
      }
    }

    if (name) {
      whereCondition.name = {
        contains: name,
        mode: 'insensitive', // Không phân biệt chữ hoa, chữ thường
      }
    }

    if (brandIds && brandIds.length) {
      whereCondition.brandId = {
        in: brandIds,
      }
    }

    if (categories && categories.length) {
      whereCondition.categories = {
        some: {
          id: {
            in: categories,
          },
        },
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereCondition.basePrice = {
        gte: minPrice,
        lte: maxPrice,
      }
    }

    //
    let customOrderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: orderBy,
    }

    if (sortedBy === ProductSortField.Price) {
      customOrderBy = {
        basePrice: orderBy,
      }
    } else if (sortedBy === ProductSortField.Sale) {
      // MEMO: Sắp xếp dựa theo số lượng của order
      customOrderBy = {
        orders: {
          _count: orderBy,
        },
      }
    }

    const $countTotalItems = this.prismaService.product.count({
      where: whereCondition,
    })
    const $getPaginatedList = this.prismaService.product.findMany({
      where: whereCondition,
      skip,
      take: limit,
      include: {
        productTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
        orders: {
          where: {
            deletedAt: null,
            status: OrderStatus.DELIVERED,
          },
        },
      },
      orderBy: customOrderBy,
    })
    const [totalItems, data] = await Promise.all([$countTotalItems, $getPaginatedList])
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, limit, page, totalPages }
  }

  getDetails({ id, isPublic }: { id: number; isPublic?: boolean }, languageId: string) {
    let whereCondition: Prisma.ProductWhereUniqueInput = {
      id,
      deletedAt: null,
    }
    const now = new Date()
    if (isPublic === true) {
      // isPublic === true -> Display published product
      // product.publicAt !== null && product.publicAt <= now
      whereCondition.publishedAt = {
        not: null,
        lte: now,
      }
    } else if (isPublic === false) {
      // isPublic === false -> Display unpublished product
      // product.publicAt === null || product.publicAt > now
      whereCondition = {
        ...whereCondition,
        OR: [{ publishedAt: null }, { publishedAt: { gt: now } }],
      }
    }
    return this.prismaService.product.findUnique({
      where: whereCondition,
      include: {
        productTranslations: {
          where:
            languageId === ALL_LANGUAGE_CODE
              ? { deletedAt: null }
              : {
                  languageId,
                  deletedAt: null,
                },
        },
        skus: {
          where: { deletedAt: null },
        },
        brand: {
          include: {
            brandTranslations: {
              where:
                languageId === ALL_LANGUAGE_CODE
                  ? { deletedAt: null }
                  : {
                      languageId,
                      deletedAt: null,
                    },
            },
          },
        },
        categories: {
          where: { deletedAt: null },
          include: {
            categoryTranslations: {
              where:
                languageId === ALL_LANGUAGE_CODE
                  ? { deletedAt: null }
                  : {
                      languageId,
                      deletedAt: null,
                    },
            },
          },
        },
      },
    })
  }

  findById(id: number): Promise<ProductType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({
    data,
    createdByUserId,
  }: {
    data: CreateProductRequestBodyType
    createdByUserId: number
  }): Promise<GetProductDetailsResponseType> {
    const { skus, categories, ...productData } = data
    return this.prismaService.product.create({
      data: {
        ...productData,
        createdByUserId,
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({ ...sku, createdByUserId })),
          },
        },
      },
      include: {
        productTranslations: {
          where: { deletedAt: null },
        },
        skus: {
          where: { deletedAt: null },
        },
        brand: {
          include: {
            brandTranslations: {
              where: { deletedAt: null },
            },
          },
        },
        categories: {
          where: { deletedAt: null },
          include: {
            categoryTranslations: {
              where: { deletedAt: null },
            },
          },
        },
      },
    })
  }

  /**
   * - SKU đã tồn tại trong db, nhưng không có trong data payload gửi lên thì sẽ bị xóa
   * - SKU đã tồn tại trong db, có trong data payload thì sẽ được update (price, stock, image)
   * - SKU không tần tại trong db, nhưng có trong data payload gửi lên thì sẽ thêm mới
   */
  async update({
    id,
    data,
    updatedByUserId,
  }: {
    id: number
    data: UpdateProductRequestBodyType
    updatedByUserId: number
  }): Promise<ProductType> {
    const { skus: payloadDataSKUs, categories, ...productData } = data

    // Get current SKUs list in db
    const productExistingSKUs = await this.prismaService.sKU.findMany({
      where: {
        productId: id,
        deletedAt: null,
      },
    })

    // Find SKUs that needs to be deleted
    const toDeleteSKUs = productExistingSKUs.filter(
      (sku) => !payloadDataSKUs.some((payloadSKU) => payloadSKU.value === sku.value),
    )

    // Mapping ID with SKU item in payload data
    const payloadDataSKUsWithId = payloadDataSKUs.map((payloadSKU) => {
      const existingSKU = productExistingSKUs.find((sku) => sku.value === payloadSKU.value)
      return {
        ...payloadSKU,
        // MEMO: Các SKU được thêm mới sẽ có id là undefined
        id: existingSKU ? existingSKU.id : undefined,
      }
    })

    // Specialize SKUs that needs to be updated
    const toUpdateSKUs = payloadDataSKUsWithId.filter((sku) => sku.id !== undefined)

    // Specialize SKUs that needs to be added
    const toAddSKUs = payloadDataSKUsWithId
      .filter((sku) => sku.id === undefined)
      .map((sku) => {
        const { id: skuId, ...data } = sku
        return { ...data, productId: id, createdByUserId: updatedByUserId }
      })

    const [product] = await this.prismaService.$transaction([
      // Update product
      this.prismaService.product.update({
        where: { id, deletedAt: null },
        data: {
          ...productData,
          updatedByUserId,
          categories: {
            set: categories.map((categoryId) => ({ id: categoryId })),
          },
        },
      }),
      // Update SKUs
      this.prismaService.sKU.updateMany({
        where: {
          id: {
            in: toDeleteSKUs.map((item) => item.id),
          },
        },
        data: {
          deletedAt: new Date(),
          updatedByUserId,
        },
      }),
      ...toUpdateSKUs.map((item) => {
        const { id: skuId, ...skuData } = item
        return this.prismaService.sKU.update({
          where: { id: skuId },
          data: {
            ...skuData,
            updatedByUserId,
          },
        })
      }),
      this.prismaService.sKU.createMany({
        data: toAddSKUs,
      }),
    ])

    return product
  }

  async delete({
    id,
    updatedByUserId,
    isHardDelete,
  }: {
    id: number
    updatedByUserId: number
    isHardDelete?: boolean
  }): Promise<ProductType> {
    if (isHardDelete) {
      // MEMO: Khi xóa product thì các relations như: ProductTranslation, SKU cũng bị xóa theo (do set cascade)
      return this.prismaService.product.delete({ where: { id } })
    }

    const now = new Date()
    const $softDeleteProduct = this.prismaService.product.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: now,
        updatedByUserId,
      },
    })
    const $softDeleteSKUs = this.prismaService.sKU.updateMany({
      where: { productId: id, deletedAt: null },
      data: {
        deletedAt: now,
        updatedByUserId,
      },
    })
    const $softDeleteProductTranslations = this.prismaService.productTranslation.updateMany({
      where: { productId: id, deletedAt: null },
      data: {
        deletedAt: now,
        updatedByUserId,
      },
    })
    const [product] = await Promise.all([$softDeleteProduct, $softDeleteSKUs, $softDeleteProductTranslations])
    return product
  }
}
