import { Injectable } from '@nestjs/common'
import {
  CreateCategoryTranslationRequestBodyType,
  GetCategoryTranslationDetailsResponseType,
  UpdateCategoryTranslationRequestBodyType,
} from 'src/routes/category-translation/category-translation.model'
import { CategoryTranslationRepository } from 'src/routes/category-translation/category-translation.repo'
import {
  AlreadyExistedCategoryTranslationException,
  NotExistedCategoryOrLanguageException,
} from 'src/routes/category-translation/category-translation.error'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepository: CategoryTranslationRepository) {}

  async findById(id: number): Promise<GetCategoryTranslationDetailsResponseType> {
    const translation = await this.categoryTranslationRepository.findById(id)
    if (!translation) throw NotFoundRecordException
    return translation
  }

  async create(payload: {
    data: CreateCategoryTranslationRequestBodyType
    createdByUserId: number
  }): Promise<GetCategoryTranslationDetailsResponseType> {
    try {
      return await this.categoryTranslationRepository.create(payload)
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedCategoryTranslationException
      if (isPrismaUniqueConstraintFailedError(error)) throw NotExistedCategoryOrLanguageException
      throw error
    }
  }

  async update(payload: {
    id: number
    data: UpdateCategoryTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<GetCategoryTranslationDetailsResponseType> {
    try {
      return await this.categoryTranslationRepository.update(payload)
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedCategoryTranslationException
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      if (isPrismaUniqueConstraintFailedError(error)) throw NotExistedCategoryOrLanguageException
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.categoryTranslationRepository.delete(payload)
      return { message: 'Delete category translation successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
