import { Injectable } from '@nestjs/common'
import {
  CreatePermissionRequestBodyType,
  GetPermissionsListRequestQueryType,
  GetPermissionsListResponseType,
  PermissionDetailsType,
  UpdatePermissionRequestBodyType,
} from 'src/routes/permission/permission.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList({ limit, page }: GetPermissionsListRequestQueryType): Promise<GetPermissionsListResponseType> {
    const skip = (page - 1) * limit
    const $countTotalItems = this.prismaService.permission.count({
      where: { deletedAt: null },
    })
    const $getPaginatedList = this.prismaService.permission.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
    })
    const [totalItems, data] = await Promise.all([$countTotalItems, $getPaginatedList])
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, limit, page, totalPages }
  }

  async findById(id: number): Promise<PermissionDetailsType | null> {
    return await this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  async create({
    data,
    createdByUserId,
  }: {
    data: CreatePermissionRequestBodyType
    createdByUserId: number
  }): Promise<PermissionDetailsType> {
    return await this.prismaService.permission.create({
      data: {
        ...data,
        createdByUserId,
      },
    })
  }

  async update({
    id,
    data,
    updatedByUserId,
  }: {
    id: number
    data: UpdatePermissionRequestBodyType
    updatedByUserId: number
  }): Promise<PermissionDetailsType> {
    return this.prismaService.permission.update({
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

  async delete({
    id,
    isHardDelete,
    updatedByUserId,
  }: {
    id: number
    isHardDelete?: boolean
    updatedByUserId: number
  }): Promise<PermissionDetailsType> {
    if (isHardDelete) {
      return await this.prismaService.permission.delete({
        where: {
          id,
        },
      })
    }
    return await this.prismaService.permission.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        updatedByUserId,
        deletedAt: new Date(),
      },
    })
  }
}
