import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  GetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
  GetProductDetailsResponseType,
} from 'src/routes/product/product.model'
import { ProductRepository } from 'src/routes/product/product.repo'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  getPaginatedList(query: GetPaginatedProductsListRequestQueryType): Promise<GetPaginatedProductsListResponseType> {
    const data = {
      page: query.page,
      limit: query.limit,
      isPublic: true,
    }
    const languageId = I18nContext.current()?.lang as string
    return this.productRepository.getPaginatedList(data, languageId)
  }

  async getDetails(id: number): Promise<GetProductDetailsResponseType> {
    const languageId = I18nContext.current()?.lang as string
    const product = await this.productRepository.getDetails({ id, isPublic: true }, languageId)
    if (!product) throw NotFoundRecordException
    return product
  }
}
