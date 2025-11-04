import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  CreateCategoryRequestBodyType,
  GetCategoriesListResponseType,
  GetCategoryDetailsResponseType,
  UpdateCategoryRequestBodyType,
} from 'src/routes/category/category.model'
import { CategoryRepository } from 'src/routes/category/category.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  getAll(parentCategoryId: number | null = null): Promise<GetCategoriesListResponseType> {
    const languageId = I18nContext.current()?.lang as string
    return this.categoryRepository.findAll({
      parentCategoryId,
      languageId,
    })
  }

  async findById(id: number): Promise<GetCategoryDetailsResponseType> {
    const languageId = I18nContext.current()?.lang as string
    const category = await this.categoryRepository.findById({
      id,
      languageId,
    })
    if (!category) throw NotFoundRecordException()
    return category
  }

  create(payload: {
    data: CreateCategoryRequestBodyType
    createdByUserId: number
  }): Promise<GetCategoryDetailsResponseType> {
    return this.categoryRepository.create(payload)
  }

  async update(payload: {
    id: number
    data: UpdateCategoryRequestBodyType
    updatedByUserId: number
  }): Promise<GetCategoryDetailsResponseType> {
    try {
      return await this.categoryRepository.update(payload)
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.categoryRepository.delete(payload)
      return {
        message: 'Delete category successfully',
      }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }
}
