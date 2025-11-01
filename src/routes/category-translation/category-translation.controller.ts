import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateCategoryTranslationRequestBodyDTO,
  GetCategoryTranslationDetailsResponseDTO,
  GetCategoryTranslationRequestParamsDTO,
  UpdateCategoryTranslationRequestBodyDTO,
} from 'src/routes/category-translation/category-translation.dto'
import { CategoryTranslationService } from 'src/routes/category-translation/category-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetCategoryTranslationDetailsResponseDTO })
  findById(@Param() params: GetCategoryTranslationRequestParamsDTO) {
    return this.categoryTranslationService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: GetCategoryTranslationDetailsResponseDTO })
  create(@Body() body: CreateCategoryTranslationRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.create({
      data: body,
      createdByUserId: userId,
    })
  }

  @Put(':id')
  @ZodResponse({ type: GetCategoryTranslationDetailsResponseDTO })
  update(
    @Param() params: GetCategoryTranslationRequestParamsDTO,
    @Body() body: UpdateCategoryTranslationRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetCategoryTranslationRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.delete({
      id: params.id,
      updatedByUserId: userId,
    })
  }
}
