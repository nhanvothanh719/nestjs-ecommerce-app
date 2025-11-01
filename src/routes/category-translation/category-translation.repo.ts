import { Injectable } from '@nestjs/common'
import {
  CreateCategoryTranslationRequestBodyType,
  GetCategoryTranslationDetailsResponseType,
  UpdateCategoryTranslationRequestBodyType,
} from 'src/routes/category-translation/category-translation.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class CategoryTranslationRepository {
  constructor(private prismaService: PrismaService) {}

  findById(id: number): Promise<GetCategoryTranslationDetailsResponseType | null> {
    return this.prismaService.categoryTranslation.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  create({
    data,
    createdByUserId,
  }: {
    data: CreateCategoryTranslationRequestBodyType
    createdByUserId: number
  }): Promise<GetCategoryTranslationDetailsResponseType> {
    return this.prismaService.categoryTranslation.create({
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
    data: UpdateCategoryTranslationRequestBodyType
    updatedByUserId: number
  }): Promise<GetCategoryTranslationDetailsResponseType> {
    return this.prismaService.categoryTranslation.update({
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
  }): Promise<GetCategoryTranslationDetailsResponseType> {
    if (isHardDelete) {
      return this.prismaService.categoryTranslation.delete({
        where: {
          id,
        },
      })
    }
    return this.prismaService.categoryTranslation.update({
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
