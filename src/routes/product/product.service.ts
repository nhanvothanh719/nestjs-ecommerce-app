import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  CreateProductRequestBodyType,
  GetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
  GetProductDetailsResponseType,
  ProductType,
  UpdateProductRequestBodyType,
} from 'src/routes/product/product.model'
import { ProductRepository } from 'src/routes/product/product.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  getPaginatedList(query: GetPaginatedProductsListRequestQueryType): Promise<GetPaginatedProductsListResponseType> {
    const languageId = I18nContext.current()?.lang as string
    return this.productRepository.getPaginatedList(query, languageId)
  }

  async findById(id: number): Promise<GetProductDetailsResponseType> {
    const languageId = I18nContext.current()?.lang as string
    const product = await this.productRepository.findById(id, languageId)
    if (!product) throw NotFoundRecordException
    return product
  }

  create(payload: {
    data: CreateProductRequestBodyType
    createdByUserId: number
  }): Promise<GetProductDetailsResponseType> {
    return this.productRepository.create(payload)
  }

  async update(payload: {
    id: number
    data: UpdateProductRequestBodyType
    updatedByUserId: number
  }): Promise<ProductType> {
    try {
      return await this.productRepository.update(payload)
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.productRepository.delete(payload)
      return { message: 'Delete product successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
