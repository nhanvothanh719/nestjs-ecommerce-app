import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateBrandRequestBodyDTO,
  GetBrandDetailsResponseDTO,
  GetBrandRequestParamsDTO,
  GetPaginatedBrandsListRequestQueryDTO,
  GetPaginatedBrandsListResponseDTO,
  UpdateBrandRequestBodyDTO,
} from 'src/routes/brand/brand.dto'
import { BrandService } from 'src/routes/brand/brand.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetPaginatedBrandsListResponseDTO })
  getPaginatedList(@Query() query: GetPaginatedBrandsListRequestQueryDTO) {
    return this.brandService.getPaginatedList(query)
  }

  @Get(':id')
  @IsPublic()
  @ZodResponse({ type: GetBrandDetailsResponseDTO })
  getById(@Param() params: GetBrandRequestParamsDTO) {
    return this.brandService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: GetBrandDetailsResponseDTO })
  create(@Body() body: CreateBrandRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: GetBrandDetailsResponseDTO })
  update(
    @Param() params: GetBrandRequestParamsDTO,
    @Body() body: UpdateBrandRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.update({ data: body, id: params.id, updatedByUserId: userId })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(@Param() params: GetBrandRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.delete({ id: params.id, updatedByUserId: userId })
  }
}
