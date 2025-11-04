import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CancelOrderRequestBodyDTO,
  CancelOrderResponseDTO,
  CreateOrderRequestBodyDTO,
  CreateOrderResponseDTO,
  GetOrderDetailsResponseDTO,
  GetOrderRequestParamsDTO,
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

  @Get(':id')
  @ZodResponse({ type: GetOrderDetailsResponseDTO })
  getDetails(@Param() params: GetOrderRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.orderService.getDetails(params.id, userId)
  }

  @Post()
  @ZodResponse({ type: CreateOrderResponseDTO })
  create(@Body() body: CreateOrderRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.orderService.create(userId, body)
  }

  @Put(':id/cancel')
  @ZodResponse({ type: CancelOrderResponseDTO })
  cancel(
    @Param() params: GetOrderRequestParamsDTO,
    @Body() _: CancelOrderRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.orderService.cancel(params.id, userId)
  }
}
