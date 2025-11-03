import { Injectable } from '@nestjs/common'
import { NotFoundProductException, NotFoundSKUException, OutOfStockSKUException } from 'src/routes/cart/cart.error'
import {
  AddToCartRequestBodyType,
  CartItemType,
  DeleteCartItemsRequestBodyType,
  GetPaginatedCartItemsResponseType,
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

  private async checkBuyableSKU(id: number): Promise<SKUType> {
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
    if (sku.stock < 1) throw OutOfStockSKUException

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
    const skip = (page - 1) * limit
    const $getCartItems = this.prismaService.cartItem.findMany({
      where: { userId },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { deletedAt: null, languageId },
                },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })
    const $totalCartItems = this.prismaService.cartItem.count({ where: { userId } })
    const [data, totalItems] = await Promise.all([$getCartItems, $totalCartItems])
    const totalPages = Math.ceil(totalItems / limit)
    return {
      totalItems,
      data,
      page,
      limit,
      totalPages,
    }
  }

  async createCartItem(userId: number, body: AddToCartRequestBodyType): Promise<CartItemType> {
    const { skuId, quantity } = body
    await this.checkBuyableSKU(skuId)

    return this.prismaService.cartItem.create({
      data: {
        userId,
        skuId,
        quantity,
      },
    })
  }

  async updateCartItem(id: number, body: UpdateCartItemRequestBodyType): Promise<CartItemType> {
    const { quantity, skuId } = body
    await this.checkBuyableSKU(skuId)

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
