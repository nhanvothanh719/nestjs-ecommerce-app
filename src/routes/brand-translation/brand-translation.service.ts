import { Injectable } from '@nestjs/common'
import {
  AlreadyExistedBrandTranslationException,
  NotExistedLanguageOrBrandException,
} from 'src/routes/brand-translation/brand-translation.error'
import {
  CreateBrandTranslationRequestBodyType,
  GetBrandTranslationDetailsResponseType,
  UpdateBrandTranslationRequestBodyType,
} from 'src/routes/brand-translation/brand-translation.model'
import { BrandTranslationRepository } from 'src/routes/brand-translation/brand-translation.repo'
import { NotFoundRecordException } from 'src/shared/error'
import {
  isPrismaForeignKeyConstraintError,
  isPrismaNotFoundError,
  isPrismaUniqueConstraintFailedError,
} from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepository: BrandTranslationRepository) {}

  async findById(id: number): Promise<GetBrandTranslationDetailsResponseType> {
    const brandTranslation = await this.brandTranslationRepository.findById(id)
    if (!brandTranslation) throw NotFoundRecordException()
    return brandTranslation
  }

  async create(payload: {
    data: CreateBrandTranslationRequestBodyType
    createdByUserId: number
  }): Promise<GetBrandTranslationDetailsResponseType> {
    try {
      return await this.brandTranslationRepository.create(payload)
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedBrandTranslationException()
      if (isPrismaForeignKeyConstraintError(error)) throw NotExistedLanguageOrBrandException()
      throw error
    }
  }

  async update(payload: {
    id: number
    data: UpdateBrandTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<GetBrandTranslationDetailsResponseType> {
    try {
      return await this.brandTranslationRepository.update(payload)
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedBrandTranslationException()
      if (isPrismaForeignKeyConstraintError(error)) throw NotExistedLanguageOrBrandException()
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.brandTranslationRepository.delete(payload)
      return { message: 'Delete brand translation successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }
}
