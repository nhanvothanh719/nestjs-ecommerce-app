import { Injectable } from '@nestjs/common'
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
  constructor(private readonly brandRepository: BrandRepository) {}

  getPaginatedList(
    paginationData: GetPaginatedBrandsListRequestQueryType,
  ): Promise<GetPaginatedBrandsListResponseType> {
    return this.brandRepository.getPaginatedList(paginationData)
  }

  async findById(id: number): Promise<GetBrandDetailsResponseType> {
    const brand = await this.brandRepository.findById(id)
    if (!brand) throw NotFoundRecordException
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
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.brandRepository.delete(payload)
      return { message: 'Delete brand successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
