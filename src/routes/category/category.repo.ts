import { Injectable } from '@nestjs/common'
import {
  CreateCategoryRequestBodyType,
  GetCategoriesListResponseType,
  GetCategoryDetailsResponseType,
  UpdateCategoryRequestBodyType,
} from 'src/routes/category/category.model'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/lang.constant'
import { CategoryType } from 'src/shared/models/category.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    parentCategoryId = null,
    languageId,
  }: {
    parentCategoryId: number | null
    languageId: string
  }): Promise<GetCategoriesListResponseType> {
    const categories = await this.prismaService.category.findMany({
      where: {
        parentCategoryId,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return {
      data: categories,
      totalItems: categories.length,
    }
  }

  findById({ id, languageId }: { id: number; languageId: string }): Promise<GetCategoryDetailsResponseType | null> {
    return this.prismaService.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    })
  }

  create({
    data,
    createdByUserId,
  }: {
    data: CreateCategoryRequestBodyType
    createdByUserId: number | null
  }): Promise<GetCategoryDetailsResponseType> {
    return this.prismaService.category.create({
      data: {
        ...data,
        createdByUserId,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    })
  }

  update({
    id,
    data,
    updatedByUserId,
  }: {
    id: number
    data: UpdateCategoryRequestBodyType
    updatedByUserId: number
  }): Promise<GetCategoryDetailsResponseType> {
    return this.prismaService.category.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedByUserId,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
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
  }): Promise<CategoryType> {
    if (isHardDelete) {
      return this.prismaService.category.delete({
        where: { id },
      })
    }
    return this.prismaService.category.update({
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
