import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateLanguageRequestBodyDTO,
  GetLanguagesListResponseDTO,
  LanguageDetailsDTO,
  UpdateLanguageRequestBodyDTO,
} from 'src/routes/language/language.dto'
import { LanguageService } from 'src/routes/language/language.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodResponse({ type: GetLanguagesListResponseDTO })
  async getAll() {
    return await this.languageService.getAll()
  }

  @Get(':id')
  @ZodResponse({ type: LanguageDetailsDTO })
  async getById(@Param('id') id: string) {
    return await this.languageService.findById(id)
  }

  @Post()
  @ZodResponse({ type: LanguageDetailsDTO })
  async create(@Body() body: CreateLanguageRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return await this.languageService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: LanguageDetailsDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateLanguageRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return await this.languageService.update({ id, updatedByUserId: userId, data: body })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  async delete(@Param('id') id: string) {
    return await this.languageService.hardDelete(id)
  }
}
