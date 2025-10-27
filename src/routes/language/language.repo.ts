import { Injectable } from '@nestjs/common'
import {
  CreateLanguageRequestBodyType,
  LanguageDetailsType,
  UpdateLanguageRequestBodyType,
} from 'src/routes/language/language.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAll(): Promise<LanguageDetailsType[]> {
    return this.prismaService.language.findMany({
      where: { deletedAt: null },
    })
  }

  findById(id: string): Promise<LanguageDetailsType | null> {
    return this.prismaService.language.findUnique({
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
    data: CreateLanguageRequestBodyType
    createdByUserId: number
  }): Promise<LanguageDetailsType> {
    return this.prismaService.language.create({
      data: {
        ...data,
        createdByUserId,
        updatedByUserId: createdByUserId,
      },
    })
  }

  update({
    id,
    updatedByUserId,
    data,
  }: {
    id: string
    updatedByUserId: number
    data: UpdateLanguageRequestBodyType
  }): Promise<LanguageDetailsType> {
    return this.prismaService.language.update({
      where: {
        id,
        deletedAt: null,
      },
      data: { ...data, updatedByUserId },
    })
  }

  delete(id: string, isHardDelete?: boolean): Promise<LanguageDetailsType> {
    if (isHardDelete) {
      return this.prismaService.language.delete({ where: { id } })
    }
    return this.prismaService.language.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
