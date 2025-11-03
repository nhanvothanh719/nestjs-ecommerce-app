import { Controller, Get, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { GetPaginatedOrdersListRequestQueryDTO, GetPaginatedOrdersListResponseDTO } from 'src/routes/order/order.dto'
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
}
