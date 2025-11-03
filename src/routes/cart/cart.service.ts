import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  AddToCartRequestBodyType,
  CartItemType,
  DeleteCartItemsRequestBodyType,
  GetPaginatedCartItemsRequestQueryType,
  UpdateCartItemRequestBodyType,
} from 'src/routes/cart/cart.model'
import { CartRepository } from 'src/routes/cart/cart.repo'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  getCart(userId: number, query: GetPaginatedCartItemsRequestQueryType) {
    const languageId = I18nContext.current()?.lang as string
    return this.cartRepository.getPaginatedCartItemsList({ ...query, userId }, languageId)
  }

  addToCart(userId: number, body: AddToCartRequestBodyType): Promise<CartItemType> {
    return this.cartRepository.createCartItem(userId, body)
  }

  updateCartItem(id: number, body: UpdateCartItemRequestBodyType): Promise<CartItemType> {
    return this.cartRepository.updateCartItem(id, body)
  }

  async deleteCartItem(userId: number, body: DeleteCartItemsRequestBodyType): Promise<ResponseMessageType> {
    const { count } = await this.cartRepository.deleteCartItem(userId, body)
    return { message: `Delete ${count} items from cart successfully` }
  }
}
