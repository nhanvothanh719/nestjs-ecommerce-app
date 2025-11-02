import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateProductTranslationRequestBodyDTO,
  GetProductTranslationDetailsResponseDTO,
  GetProductTranslationRequestParamsDTO,
  ProductTranslationDTO,
  UpdateProductTranslationRequestBodyDTO,
} from 'src/routes/product-translation/product-translation.dto'
import { ProductTranslationService } from 'src/routes/product-translation/product-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetProductTranslationDetailsResponseDTO })
  findById(@Param() params: GetProductTranslationRequestParamsDTO) {
    return this.productTranslationService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: ProductTranslationDTO })
  create(@Body() body: CreateProductTranslationRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create({
      data: body,
      createdByUserId: userId,
    })
  }

  @Put(':id')
  @ZodResponse({ type: ProductTranslationDTO })
  update(
    @Param() params: GetProductTranslationRequestParamsDTO,
    @Body() body: UpdateProductTranslationRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetProductTranslationRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.delete({
      id: params.id,
      updatedByUserId: userId,
    })
  }
}
