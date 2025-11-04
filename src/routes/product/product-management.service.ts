import { ForbiddenException, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  CreateProductRequestBodyType,
  ForManagementGetPaginatedProductsListRequestQueryType,
  GetPaginatedProductsListResponseType,
  GetProductDetailsResponseType,
  UpdateProductRequestBodyType,
} from 'src/routes/product/product.model'
import { ProductRepository } from 'src/routes/product/product.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError } from 'src/shared/helpers'
import { ProductType } from 'src/shared/models/product.model'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class ProductManagementService {
  constructor(private readonly productRepository: ProductRepository) {}

  getPaginatedList(props: {
    query: ForManagementGetPaginatedProductsListRequestQueryType
    actorUserId: number
    actorRoleName: string
  }): Promise<GetPaginatedProductsListResponseType> {
    const { query, actorUserId, actorRoleName } = props
    const languageId = I18nContext.current()?.lang as string

    this.checkActorPrivilege({
      actorUserId,
      actorRoleName,
      createdByUserId: query.createdByUserId,
    })

    return this.productRepository.getPaginatedList(query, languageId)
  }

  async findById(props: {
    id: number
    actorUserId: number
    actorRoleName: string
  }): Promise<GetProductDetailsResponseType> {
    const { id, actorUserId, actorRoleName } = props
    const languageId = I18nContext.current()?.lang as string

    const product = await this.productRepository.getDetails({ id }, languageId)
    if (!product) throw NotFoundRecordException()

    this.checkActorPrivilege({
      actorUserId,
      actorRoleName,
      createdByUserId: product.createdByUserId,
    })

    return product
  }

  create(payload: {
    data: CreateProductRequestBodyType
    createdByUserId: number
    actorRoleName: string
  }): Promise<GetProductDetailsResponseType> {
    const { createdByUserId, actorRoleName, data } = payload
    this.checkActorPrivilege({
      actorUserId: createdByUserId,
      actorRoleName,
      createdByUserId: createdByUserId,
    })

    return this.productRepository.create({ data, createdByUserId })
  }

  async update(payload: {
    id: number
    data: UpdateProductRequestBodyType
    updatedByUserId: number
    actorRoleName: string
  }): Promise<ProductType> {
    const { id, updatedByUserId, actorRoleName } = payload

    const product = await this.productRepository.findById(id)
    if (!product) throw NotFoundRecordException()

    this.checkActorPrivilege({
      actorUserId: updatedByUserId,
      actorRoleName,
      createdByUserId: product.createdByUserId,
    })

    try {
      return await this.productRepository.update(payload)
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number; actorRoleName: string }): Promise<ResponseMessageType> {
    try {
      const { id, updatedByUserId, actorRoleName } = payload

      const product = await this.productRepository.findById(id)
      if (!product) throw NotFoundRecordException()

      this.checkActorPrivilege({
        actorUserId: updatedByUserId,
        actorRoleName,
        createdByUserId: product.createdByUserId,
      })

      await this.productRepository.delete(payload)
      return { message: 'Delete product successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  /**
   * Throw lỗi nếu người thực hiện hành động **không phải** là Admin hoặc Seller của product
   */
  private checkActorPrivilege({
    actorUserId,
    actorRoleName,
    createdByUserId,
  }: {
    actorUserId: number
    actorRoleName: string
    createdByUserId: number | null | undefined
  }) {
    if (actorRoleName === RoleName.Admin) return true
    if (actorRoleName === RoleName.Seller && actorUserId === createdByUserId) return true
    throw new ForbiddenException()
  }
}
