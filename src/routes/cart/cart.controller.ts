import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  AddToCartRequestBodyDTO,
  CartItemDTO,
  DeleteCartItemsRequestBodyDTO,
  GetCartItemRequestParamsDTO,
  GetPaginatedCartItemsRequestQueryDTO,
  GetPaginatedCartItemsResponseDTO,
  UpdateCartItemRequestBodyDTO,
} from 'src/routes/cart/cart.dto'
import { CartService } from 'src/routes/cart/cart.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodResponse({ type: GetPaginatedCartItemsResponseDTO })
  getCart(@Query() query: GetPaginatedCartItemsRequestQueryDTO, @ActiveUser('userId') userId: number) {
    return this.cartService.getCart(userId, query)
  }

  @Post()
  @ZodResponse({ type: CartItemDTO })
  addToCart(@Body() body: AddToCartRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.cartService.addToCart(userId, body)
  }

  @Put(':id')
  @ZodResponse({ type: CartItemDTO })
  updateCartItem(
    @Param() params: GetCartItemRequestParamsDTO,
    @Body() body: UpdateCartItemRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.cartService.updateCartItem(params.id, userId, body)
  }

  @Post('delete')
  @ZodResponse({ type: ResponseMessageDTO })
  deleteCartItem(@Body() body: DeleteCartItemsRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.cartService.deleteCartItem(userId, body)
  }
}
