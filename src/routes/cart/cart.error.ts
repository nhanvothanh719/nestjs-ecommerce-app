import { BadRequestException, NotFoundException } from '@nestjs/common'

export const NotFoundSKUException = new NotFoundException('Error.SKU.NotFound')

export const OutOfStockSKUException = new BadRequestException('Error.SKU.OutOfStock')

export const NotFoundProductException = new NotFoundException('Error.Product.NotFound')

export const NotFoundCartException = new NotFoundException('Error.CartItem.NotFoundCart')

export const ExceedingAllowedAddedCartItemAmountException = new BadRequestException(
  'Error.CartItem.ExceedingAllowedAddedCartItemAmount',
)
