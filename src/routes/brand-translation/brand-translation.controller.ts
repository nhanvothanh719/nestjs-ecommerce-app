import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateBrandTranslationRequestBodyDTO,
  GetBrandTranslationDetailsResponseDTO,
  GetBrandTranslationRequestParamsDTO,
  UpdateBrandTranslationRequestBodyDTO,
} from 'src/routes/brand-translation/brand-translation.dto'
import { BrandTranslationService } from 'src/routes/brand-translation/brand-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetBrandTranslationDetailsResponseDTO })
  getById(@Param() params: GetBrandTranslationRequestParamsDTO) {
    return this.brandTranslationService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: GetBrandTranslationDetailsResponseDTO })
  create(@Body() body: CreateBrandTranslationRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create({
      data: body,
      createdByUserId: userId,
    })
  }

  @Put(':id')
  @ZodResponse({ type: GetBrandTranslationDetailsResponseDTO })
  update(
    @Param() params: GetBrandTranslationRequestParamsDTO,
    @Body() body: UpdateBrandTranslationRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetBrandTranslationRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.delete({
      id: params.id,
      updatedByUserId: userId,
    })
  }
}
