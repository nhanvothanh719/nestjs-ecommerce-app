import { Injectable } from '@nestjs/common'
import {
  CancelOrderResponseType,
  CreateOrderRequestBodyType,
  CreateOrderResponseType,
  GetOrderDetailsResponseType,
  GetPaginatedOrdersListRequestQueryType,
  GetPaginatedOrdersListResponseType,
} from 'src/routes/order/order.model'
import { OrderRepository } from 'src/routes/order/order.repo'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  getPaginatedList(
    userId: number,
    query: GetPaginatedOrdersListRequestQueryType,
  ): Promise<GetPaginatedOrdersListResponseType> {
    return this.orderRepository.getPaginatedList(userId, query)
  }

  create(userId: number, body: CreateOrderRequestBodyType): Promise<CreateOrderResponseType> {
    return this.orderRepository.create(userId, body)
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
