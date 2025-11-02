import { Injectable } from '@nestjs/common'
import { AlreadyExistedProductTranslationException } from 'src/routes/product-translation/product-translation.error'
import {
  CreateProductTranslationRequestBodyType,
  GetProductTranslationDetailsResponseType,
  ProductTranslationType,
  UpdateProductTranslationRequestBodyType,
} from 'src/routes/product-translation/product-translation.model'
import { ProductTranslationRepository } from 'src/routes/product-translation/product-translation.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepository: ProductTranslationRepository) {}

  async findById(id: number): Promise<GetProductTranslationDetailsResponseType> {
    const translation = await this.productTranslationRepository.findById(id)
    if (!translation) throw NotFoundRecordException
    return translation
  }

  async create(payload: {
    data: CreateProductTranslationRequestBodyType
    createdByUserId: number
  }): Promise<ProductTranslationType> {
    try {
      return await this.productTranslationRepository.create(payload)
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedProductTranslationException
      throw error
    }
  }

  async update(payload: {
    id: number
    data: UpdateProductTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<ProductTranslationType> {
    try {
      return await this.productTranslationRepository.update(payload)
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedProductTranslationException
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.productTranslationRepository.delete(payload)
      return { message: 'Delete product translation successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
