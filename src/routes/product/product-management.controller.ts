import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { ProductManagementService } from 'src/routes/product/product-management.service'
import {
  CreateProductRequestBodyDTO,
  ForManagementGetPaginatedProductsListRequestQueryDTO,
  GetPaginatedProductsListResponseDTO,
  GetProductDetailsResponseDTO,
  GetProductRequestParamsDTO,
  ProductDTO,
  UpdateProductRequestBodyDTO,
} from 'src/routes/product/product.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'
import type { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('product-management/products')
export class ProductManagementController {
  constructor(private readonly productManagementService: ProductManagementService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetPaginatedProductsListResponseDTO })
  getPaginatedList(
    @Query() query: ForManagementGetPaginatedProductsListRequestQueryDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.productManagementService.getPaginatedList({
      query,
      actorRoleName: user.roleName,
      actorUserId: user.userId,
    })
  }

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetProductDetailsResponseDTO })
  findById(@Param() params: GetProductRequestParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.productManagementService.findById({
      id: params.id,
      actorRoleName: user.roleName,
      actorUserId: user.userId,
    })
  }

  @Post()
  @ZodResponse({ type: GetProductDetailsResponseDTO })
  create(@Body() body: CreateProductRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.productManagementService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: ProductDTO })
  update(
    @Param() params: GetProductRequestParamsDTO,
    @Body() body: UpdateProductRequestBodyDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.productManagementService.update({
      id: params.id,
      data: body,
      updatedByUserId: user.userId,
      actorRoleName: user.roleName,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetProductRequestParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.productManagementService.delete({
      id: params.id,
      updatedByUserId: user.userId,
      actorRoleName: user.roleName,
    })
  }
}
