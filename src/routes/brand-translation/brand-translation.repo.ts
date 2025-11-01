import { Injectable } from '@nestjs/common'
import {
  CreateBrandTranslationRequestBodyType,
  GetBrandTranslationDetailsResponseType,
  UpdateBrandTranslationRequestBodyType,
} from 'src/routes/brand-translation/brand-translation.model'
import { BrandTranslationType } from 'src/shared/models/brand-translation.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetBrandTranslationDetailsResponseType | null> {
    return this.prismaService.brandTranslation.findUnique({
      where: { id, deletedAt: null },
    })
  }

  create({
    data,
    createdByUserId,
  }: {
    data: CreateBrandTranslationRequestBodyType
    createdByUserId: number
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.create({
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
    data: UpdateBrandTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
      where: { id, deletedAt: null },
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
  }): Promise<BrandTranslationType> {
    if (isHardDelete) {
      return this.prismaService.brandTranslation.delete({
        where: { id },
      })
    }
    return this.prismaService.brandTranslation.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        updatedByUserId,
      },
    })
  }
}
