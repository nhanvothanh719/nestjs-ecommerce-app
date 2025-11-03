import { Injectable } from '@nestjs/common'
import {
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
}
