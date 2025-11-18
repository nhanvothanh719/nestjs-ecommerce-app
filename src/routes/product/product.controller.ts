import { Controller, Get, Param, Query } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { ZodResponse } from 'nestjs-zod'
import {
  GetPaginatedProductsListRequestQueryDTO,
  GetPaginatedProductsListResponseDTO,
  GetProductDetailsResponseDTO,
  GetProductRequestParamsDTO,
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

// Bỏ qua áp dụng rate limiting đối với các routes trong này
@SkipThrottle()
@Controller('products')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Vẫn áp dụng rate limit đối với route này
  @SkipThrottle({ default: false})
  @Get()
  @ZodResponse({ type: GetPaginatedProductsListResponseDTO })
  getPaginatedList(@Query() query: GetPaginatedProductsListRequestQueryDTO) {
    return this.productService.getPaginatedList(query)
  }

  @Get(':id')
  @ZodResponse({ type: GetProductDetailsResponseDTO })
  findById(@Param() params: GetProductRequestParamsDTO) {
    return this.productService.getDetails(params.id)
  }
}
