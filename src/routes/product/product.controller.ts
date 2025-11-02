import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateProductRequestBodyDTO,
  GetPaginatedProductsListRequestQueryDTO,
  GetPaginatedProductsListResponseDTO,
  GetProductDetailsResponseDTO,
  GetProductRequestParamsDTO,
  ProductDTO,
  UpdateProductRequestBodyDTO,
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetPaginatedProductsListResponseDTO })
  getPaginatedList(@Query() query: GetPaginatedProductsListRequestQueryDTO) {
    return this.productService.getPaginatedList(query)
  }

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetProductDetailsResponseDTO })
  findById(@Param() params: GetProductRequestParamsDTO) {
    return this.productService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: GetProductDetailsResponseDTO })
  create(@Body() body: CreateProductRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.productService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: ProductDTO })
  update(
    @Param() params: GetProductRequestParamsDTO,
    @Body() body: UpdateProductRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetProductRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.productService.delete({
      id: params.id,
      updatedByUserId: userId,
    })
  }
}
