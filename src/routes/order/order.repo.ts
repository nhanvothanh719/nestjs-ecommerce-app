import { Injectable } from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import {
  CannotCancelOrderException,
  NotBelongToCorrectShopSKUException,
  NotFoundCartItemException,
  NotFoundProductException,
  OutOfStockSKUException,
} from 'src/routes/order/order.error'
import {
  CancelOrderResponseType,
  CreateOrderRequestBodyType,
  CreateOrderResponseType,
  GetOrderDetailsResponseType,
  GetPaginatedOrdersListRequestQueryType,
  GetPaginatedOrdersListResponseType,
} from 'src/routes/order/order.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { PaymentStatus } from 'src/shared/constants/payment.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
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

  async create(userId: number, body: CreateOrderRequestBodyType): Promise<CreateOrderResponseType> {
    // Tổng hợp tất cả cart item ids trong tất cả các item trong request body
    const allCartItemIds: number[] = body.map((item) => item.cartItemIds).flat()

    // Lấy tất cả các cart item từ database
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allCartItemIds,
        },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true,
              },
            },
          },
        },
      },
    })

    // Kiểm tra nếu số lượng cart item trong request body không trùng với số lượng cart item trong database
    if (cartItems.length !== allCartItemIds.length) throw NotFoundCartItemException()

    // Kiểm tra nếu có sản phẩm nào out of stock
    const isOutOfStock = cartItems.some((item) => {
      return item.sku.stock < item.quantity
    })
    if (isOutOfStock) throw OutOfStockSKUException()

    // Check sản phầm chưa bị xóa hay chưa được publish
    const hasUnavailableProduct = cartItems.some((item) => {
      return (
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        (item.sku.product.publishedAt && item.sku.product.publishedAt > new Date())
      )
    })
    if (hasUnavailableProduct) throw NotFoundProductException()

    // Tạo map để lưu trữ cart item id và cart item
    const cartItemMap = new Map<number, (typeof cartItems)[0]>()
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item)
    })

    // Kiểm tra tất cả cart item được gom nhóm đều thuộc cùng 1 shop
    const isCartItemsBelongToCorrectShop = body.every((item) => {
      const groupedCartItemIds = item.cartItemIds

      return groupedCartItemIds.every((cartItemId) => {
        const cartItem = cartItemMap.get(cartItemId)!
        return item.shopId === cartItem.sku.createdByUserId
      })
    })
    if (!isCartItemsBelongToCorrectShop) throw NotBelongToCorrectShopSKUException()

    // Tạo order, tạo snapshot sản phẩm (items), liên kết sản phẩm, rollback nếu có bất kỳ lỗi nào
    // MEMO: `tx` same as `transactionService`, but can only used in callback function
    const orders = await this.prismaService.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          status: PaymentStatus.PENDING,
        },
      })

      // Tạo orders
      const $createOrders = Promise.all(
        // Lưu ý: Sử dụng vòng lặp + create thay vì createMany vì createMany không cho phép tạo item của các table liên quan
        body.map((item) =>
          // Mỗi shop tạo 1 order, order chứa các item (snapshot sản phẩm)
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdByUserId: userId,
              shopId: item.shopId,
              paymentId: payment.id,
              items: {
                // Tạo snapshot sản phẩm cho mỗi cart item (tạo record vào bảng `ProductSKUSnapshot`)
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    skuImage: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.productId,
                    productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                      return {
                        id: translation.id,
                        name: translation.name,
                        description: translation.description,
                        languageId: translation.languageId,
                      }
                    }),
                  }
                }),
              },
              // Tạo liên kết với bảng Product (thông qua việc insert record vào bảng trung gian `_OrderToProduct`)
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    id: cartItem.sku.product.id,
                  }
                }),
              },
            },
          }),
        ),
      )

      // Xóa item trong giỏ hàng sau khi tạo order thành công
      const $deleteCartItems = tx.cartItem.deleteMany({
        where: {
          id: {
            in: allCartItemIds,
          },
        },
      })

      // Giảm số lượng SKU đang còn trong kho
      const $updateQuantitySKU = Promise.all(
        cartItems.map((item) => {
          return tx.sKU.update({
            where: {
              id: item.sku.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }),
      )

      const [createdOrders] = await Promise.all([$createOrders, $deleteCartItems, $updateQuantitySKU])
      return createdOrders
    })

    return { data: orders }
  }

  async getDetails(id: number, userId: number): Promise<GetOrderDetailsResponseType | null> {
    return this.prismaService.order.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        // ProductSKUSnapshot items
        items: true,
      },
    })
  }

  async cancel(id: number, userId: number): Promise<CancelOrderResponseType> {
    try {
      const whereCondition: Prisma.OrderWhereUniqueInput = { id, userId, deletedAt: null }

      const order = await this.prismaService.order.findUniqueOrThrow({ where: whereCondition })
      // Allow to cancel an order in case its status is `PENDING_PAYMENT`
      if (order.status !== OrderStatus.PENDING_PAYMENT) throw CannotCancelOrderException()

      const updatedOrder = await this.prismaService.order.update({
        where: whereCondition,
        data: {
          status: OrderStatus.CANCELLED,
          updatedByUserId: userId,
        },
      })

      return updatedOrder
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }
}
