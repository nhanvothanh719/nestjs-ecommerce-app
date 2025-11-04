import { Injectable } from '@nestjs/common'
import {
  CreateProductTranslationRequestBodyType,
  GetProductTranslationDetailsResponseType,
  UpdateProductTranslationRequestBodyType,
} from 'src/routes/product-translation/product-translation.model'
import { ProductTranslationType } from 'src/shared/models/product-translation.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetProductTranslationDetailsResponseType | null> {
    return this.prismaService.productTranslation.findUnique({
      where: { id, deletedAt: null },
    })
  }

  create({
    data,
    createdByUserId,
  }: {
    data: CreateProductTranslationRequestBodyType
    createdByUserId: number
  }): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.create({
      data: {
        ...data,
        createdByUserId,
      },
    })
  }

  update({
    id,
    data,
    updatedByUserId,
  }: {
    id: number
    data: UpdateProductTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedByUserId,
      },
    })
  }

  delete({
    id,
    updatedByUserId,
    isHardDelete,
  }: {
    id: number
    updatedByUserId: number
    isHardDelete?: boolean
  }): Promise<ProductTranslationType> {
    if (isHardDelete) {
      return this.prismaService.productTranslation.delete({
        where: { id },
      })
    }
    return this.prismaService.productTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedByUserId,
      },
    })
  }
}
