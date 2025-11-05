import { BadRequestException, Injectable } from '@nestjs/common'
import { parse } from 'date-fns'
import { WebhookPaymentRequestBodyType } from 'src/routes/payment/payment.model'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { PAYMENT_CODE_PREFIX, PaymentStatus } from 'src/shared/constants/payment.constant'
import { OrderWithProductSKUSnapshotsType } from 'src/shared/models/order.model'
import { ResponseMessageType } from 'src/shared/models/response.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async receiver(body: WebhookPaymentRequestBodyType): Promise<ResponseMessageType & { paymentId: number }> {
    const {
      id,
      transferType,
      transferAmount,
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      accumulated,
      code,
      content,
      referenceCode,
      description,
    } = body

    // Thêm thông tin giao dịch vào db
    let amountIn = 0,
      amountOut = 0

    if (transferType === 'in') {
      amountIn = transferAmount
    } else if (transferType === 'out') {
      amountOut = transferAmount
    }

    // Kiểm tra transaction để tránh việc retry làm thay đổi kết quả từ server Sepay
    const paymentTransaction = await this.prismaService.paymentTransaction.findUnique({
      where: { id },
    })
    if (paymentTransaction) throw new BadRequestException('Transaction already exists')

    // Lưu vào database
    await this.prismaService.paymentTransaction.create({
      data: {
        id,
        gateway,
        transactionDate: parse(transactionDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
        accountNumber,
        subAccount,
        amountIn,
        amountOut,
        accumulated,
        code,
        transactionContent: content,
        referenceNumber: referenceCode,
        body: description,
      },
    })

    // Kiểm tra nội dung chuyển khoản
    const paymentId = code ? Number(code.split(PAYMENT_CODE_PREFIX)[1]) : Number(content?.split(PAYMENT_CODE_PREFIX)[1])
    if (isNaN(paymentId)) throw new BadRequestException('Cannot get payment id from content')

    const payment = await this.prismaService.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        orders: {
          include: {
            items: true, // Product SKU Snapshots
          },
        },
      },
    })
    if (!payment) throw new BadRequestException(`Payment with id: ${paymentId} is not found`)

    // Kiểm tra số tiền
    const { orders } = payment
    const calculatedOrdersTotalPrice = this.getOrdersTotalPrice(orders)
    if (calculatedOrdersTotalPrice !== transferAmount)
      throw new BadRequestException(
        `Price not match, expect ${calculatedOrdersTotalPrice}, but got ${transferAmount} instead`,
      )

    // Cập nhật status của order + payment
    await this.prismaService.$transaction([
      // Update payment status
      this.prismaService.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.SUCCESS,
        },
      }),
      // Update order status
      this.prismaService.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
        },
        data: {
          status: OrderStatus.PENDING_PICKUP,
        },
      }),
    ])

    return { paymentId, message: 'Successful payment' }
  }

  private getOrdersTotalPrice(orders: OrderWithProductSKUSnapshotsType[]): number {
    return orders.reduce((totalPrice, order) => {
      const totalPricePerOrder = order.items.reduce((itemsTotalPrice, item) => {
        return itemsTotalPrice + item.skuPrice * item.quantity
      }, 0)
      return totalPrice + totalPricePerOrder
    }, 0)
  }
}
