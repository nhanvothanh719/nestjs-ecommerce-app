import { Injectable } from '@nestjs/common'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { PaymentStatus } from 'src/shared/constants/payment.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedPaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async cancelOrderPayment(paymentId: number) {
    const payment = await this.prismaService.payment.findUnique({
      where: { id: paymentId },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!payment) throw Error('Payment not found')

    const { orders } = payment
    const productSKUSnapshots = orders.map((order) => order.items).flat()

    await this.prismaService.$transaction(async (tx) => {
      // Cancel những đơn hàng đang ở trạng thái chờ thanh toán
      const $updateOrder = tx.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
          status: OrderStatus.PENDING_PAYMENT,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      })

      const $updateSKUs = Promise.all(
        productSKUSnapshots
          .filter((item) => item.skuId) // Loại bỏ các snapshot với skuId là null
          .map((item) =>
            tx.sKU.update({
              where: {
                id: item.skuId as number,
              },
              data: {
                stock: {
                  increment: item.quantity, // Revert lại giá trị số lượng SP trong stock
                },
              },
            }),
          ),
      )

      const $updatePayment = tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED },
      })

      return await Promise.all([$updateOrder, $updateSKUs, $updatePayment])
    })
  }
}
