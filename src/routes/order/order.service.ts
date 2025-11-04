import { Injectable } from '@nestjs/common'
import {
  CancelOrderResponseType,
  CreateOrderRequestBodyType,
  CreateOrderResponseType,
  GetOrderDetailsResponseType,
  GetPaginatedOrdersListRequestQueryType,
  GetPaginatedOrdersListResponseType,
} from 'src/routes/order/order.model'
import { OrderProducer } from 'src/routes/order/order.producer'
import { OrderRepository } from 'src/routes/order/order.repo'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private orderProducer: OrderProducer,
  ) {}

  getPaginatedList(
    userId: number,
    query: GetPaginatedOrdersListRequestQueryType,
  ): Promise<GetPaginatedOrdersListResponseType> {
    return this.orderRepository.getPaginatedList(userId, query)
  }

  async create(userId: number, body: CreateOrderRequestBodyType): Promise<CreateOrderResponseType> {
    const result = await this.orderRepository.create(userId, body)

    await this.orderProducer.addCancelPaymentJob(result.paymentId)
    return result
  }

  async getDetails(id: number, userId: number): Promise<GetOrderDetailsResponseType> {
    const order = await this.orderRepository.getDetails(id, userId)
    if (!order) throw NotFoundRecordException()
    return order
  }

  cancel(id: number, userId: number): Promise<CancelOrderResponseType> {
    return this.orderRepository.cancel(id, userId)
  }
}
