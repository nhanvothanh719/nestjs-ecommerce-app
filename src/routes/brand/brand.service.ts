import { Injectable } from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'
import {
  CreateBrandRequestBodyType,
  GetBrandDetailsResponseType,
  GetPaginatedBrandsListRequestQueryType,
  GetPaginatedBrandsListResponseType,
  UpdateBrandRequestBodyType,
} from 'src/routes/brand/brand.model'
import { BrandRepository } from 'src/routes/brand/brand.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  getPaginatedList(
    paginationData: GetPaginatedBrandsListRequestQueryType,
  ): Promise<GetPaginatedBrandsListResponseType> {
    const languageId = I18nContext.current()?.lang as string
    return this.brandRepository.getPaginatedList(paginationData, languageId)
  }

  async findById(id: number): Promise<GetBrandDetailsResponseType> {
    // MEMO: Dùng để test i18n
    // const lang = I18nContext.current()?.lang
    // console.log('>>> Test: ', this.i18n.t('error.NOT_FOUND', { lang }))
    const languageId = I18nContext.current()?.lang as string
    const brand = await this.brandRepository.findById(id, languageId)
    if (!brand) throw NotFoundRecordException()
    return brand
  }

  create(payload: { data: CreateBrandRequestBodyType; createdByUserId: number }): Promise<GetBrandDetailsResponseType> {
    return this.brandRepository.create(payload)
  }

  async update(payload: {
    id: number
    data: UpdateBrandRequestBodyType
    updatedByUserId: number
  }): Promise<GetBrandDetailsResponseType> {
    try {
      return await this.brandRepository.update(payload)
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.brandRepository.delete(payload)
      return { message: 'Delete brand successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }
}
