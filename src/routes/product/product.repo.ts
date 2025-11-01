import { Injectable } from '@nestjs/common'
import {
  CreateProductRequestBodyType,
  GetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
  GetProductDetailsResponseType,
  ProductType,
  UpdateProductRequestBodyType,
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

  findById(id: number, languageId: string): Promise<GetProductDetailsResponseType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
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
            data: skus,
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
            connect: categories.map((categoryId) => ({ id: categoryId })),
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
        return this.prismaService.sKU.update({
          where: { id: item.id },
          data: {
            ...item,
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
      const $deleteProduct = this.prismaService.product.delete({ where: { id } })
      const $deleteSKUs = this.prismaService.sKU.deleteMany({ where: { productId: id } })
      const [product] = await Promise.all([$deleteProduct, $deleteSKUs])
      return product
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
    const [product] = await Promise.all([$softDeleteProduct, $softDeleteSKUs])
    return product
  }
}
