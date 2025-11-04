import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateOrderRequestBodyDTO,
  CreateOrderResponseDTO,
  GetPaginatedOrdersListRequestQueryDTO,
  GetPaginatedOrdersListResponseDTO,
} from 'src/routes/order/order.dto'
import { OrderService } from 'src/routes/order/order.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodResponse({ type: GetPaginatedOrdersListResponseDTO })
  getPaginatedList(@Query() query: GetPaginatedOrdersListRequestQueryDTO, @ActiveUser('userId') userId: number) {
    return this.orderService.getPaginatedList(userId, query)
  }

  @Post()
  @ZodResponse({ type: CreateOrderResponseDTO })
  create(@Body() body: CreateOrderRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.orderService.create(userId, body)
  }
}
