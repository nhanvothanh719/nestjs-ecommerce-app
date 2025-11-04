import { Injectable } from '@nestjs/common'
import {
  CreateOrderRequestBodyType,
  CreateOrderResponseType,
  GetPaginatedOrdersListRequestQueryType,
  GetPaginatedOrdersListResponseType,
} from 'src/routes/order/order.model'
import { OrderRepository } from 'src/routes/order/order.repo'

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
}
