import { Injectable } from '@nestjs/common'
import { NotFoundProductException, NotFoundSKUException, OutOfStockSKUException } from 'src/routes/cart/cart.error'
import {
  AddToCartRequestBodyType,
  CartItemType,
  DeleteCartItemsRequestBodyType,
  GetPaginatedCartItemsResponseType,
  GroupedCartItemsType,
  UpdateCartItemRequestBodyType,
} from 'src/routes/cart/cart.model'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/lang.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
import { SKUType } from 'src/shared/models/sku.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkBuyableSKU(id: number, quantity: number): Promise<SKUType> {
    const sku = await this.prismaService.sKU.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    })

    if (!sku) throw NotFoundSKUException
    if (sku.stock < 1 || sku.stock < quantity) throw OutOfStockSKUException

    const { product } = sku

    const isDeletedProduct = product.deletedAt !== null
    const isUnpublishedProduct =
      product.publishedAt === null || (product.publishedAt && product.publishedAt > new Date())
    if (isDeletedProduct || isUnpublishedProduct) throw NotFoundProductException

    return sku
  }

  async getPaginatedCartItemsList(
    { userId, page, limit }: { userId: number; page: number; limit: number },
    languageId: string,
  ): Promise<GetPaginatedCartItemsResponseType> {
    // Lấy danh sách items trong giỏ hàng
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        userId,
        sku: { product: { deletedAt: null, publishedAt: { not: null, lte: new Date() } } },
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId },
                },
                createdBy: true, // User type
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Xử lý gom nhóm items trong giỏ hàng
    const cartItemsGroupMap = new Map<number, GroupedCartItemsType>()
    for (const item of cartItems) {
      // Shop là người tạo ra SP
      const shopId = item.sku.product.createdByUserId

      if (shopId) {
        if (!cartItemsGroupMap.has(shopId)) {
          cartItemsGroupMap.set(shopId, { shop: item.sku.product.createdBy, cartItems: [] })
        }
        cartItemsGroupMap.get(shopId)?.cartItems.push(item)
      }
    }

    const sortedGroups = Array.from(cartItemsGroupMap.values())

    // Xử lý phân trang theo shop
    const skip = (page - 1) * limit
    const totalItems = sortedGroups.length
    const paginatedGroups = sortedGroups.slice(skip, skip + limit)
    const totalPages = Math.ceil(totalItems / limit)
    return {
      totalItems,
      data: paginatedGroups,
      page,
      limit,
      totalPages,
    }
  }

  async createCartItem(userId: number, body: AddToCartRequestBodyType): Promise<CartItemType> {
    const { skuId, quantity } = body
    await this.checkBuyableSKU(skuId, quantity)

    return this.prismaService.cartItem.upsert({
      where: {
        // @@unique([userId, skuId])
        userId_skuId: {
          userId,
          skuId,
        },
      },
      // update -> Tăng số lượng quantity trong db
      update: {
        quantity: {
          increment: quantity,
        },
      },
      // create -> Thêm item vào giỏ hàng
      create: {
        userId,
        skuId,
        quantity,
      },
    })
  }

  async updateCartItem(id: number, body: UpdateCartItemRequestBodyType): Promise<CartItemType> {
    const { quantity, skuId } = body
    await this.checkBuyableSKU(skuId, quantity)

    try {
      return await this.prismaService.cartItem.update({
        where: { id },
        data: {
          skuId,
          quantity,
        },
      })
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }

  deleteCartItem(userId: number, body: DeleteCartItemsRequestBodyType): Promise<{ count: number }> {
    const { ids } = body

    return this.prismaService.cartItem.deleteMany({
      where: {
        userId,
        id: {
          in: ids,
        },
      },
    })
  }
}
