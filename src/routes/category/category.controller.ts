import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateCategoryRequestBodyDTO,
  GetCategoriesListRequestQueryDTO,
  GetCategoriesListResponseDTO,
  GetCategoryDetailsResponseDTO,
  GetCategoryRequestParamsDTO,
  UpdateCategoryRequestBodyDTO,
} from 'src/routes/category/category.dto'
import { CategoryService } from 'src/routes/category/category.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetCategoriesListResponseDTO })
  getAll(@Query() query: GetCategoriesListRequestQueryDTO) {
    return this.categoryService.getAll(query.parentCategoryId)
  }

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetCategoryDetailsResponseDTO })
  findById(@Param() params: GetCategoryRequestParamsDTO) {
    return this.categoryService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: GetCategoryDetailsResponseDTO })
  create(@Body() body: CreateCategoryRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryService.create({
      data: body,
      createdByUserId: userId,
    })
  }

  @Put(':id')
  @ZodResponse({ type: GetCategoryDetailsResponseDTO })
  update(
    @Param() params: GetCategoryRequestParamsDTO,
    @Body() body: UpdateCategoryRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetCategoryRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.categoryService.delete({
      id: params.id,
      updatedByUserId: userId,
    })
  }
}
