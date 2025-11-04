import { BadRequestException, NotFoundException } from '@nestjs/common'

export const NotFoundOrderException = new NotFoundException('Error.NotFoundOrder')
export const NotFoundProductException = new NotFoundException('Error.NotFoundProduct')
export const OutOfStockSKUException = new BadRequestException('Error.OutOfStockSKU')
export const NotFoundCartItemException = new NotFoundException('Error.NotFoundCartItem')
export const NotBelongToCorrectShopSKUException = new BadRequestException('Error.NotBelongToCorrectShopSKU')
export const CannotCancelOrderException = new BadRequestException('Error.CannotCancelOrder')
