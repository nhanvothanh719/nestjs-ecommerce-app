import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  GetPaginatedProductsListRequestQueryDTO,
  GetPaginatedProductsListResponseDTO,
  GetProductDetailsResponseDTO,
  GetProductRequestParamsDTO,
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('products')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
