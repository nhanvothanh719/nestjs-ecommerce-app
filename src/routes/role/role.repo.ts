import { Injectable } from '@nestjs/common'
import {
  CreateRoleRequestBodyType,
  CreateRoleResponseType,
  GetRolesListRequestQueryType,
  GetRolesListResponseType,
  RoleDetailsType,
  UpdateRoleRequestBodyType,
} from 'src/routes/role/role.model'
import { RoleType } from 'src/shared/models/role.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList({ limit, page }: GetRolesListRequestQueryType): Promise<GetRolesListResponseType> {
    const skip = (page - 1) * limit
    const $countTotalItems = this.prismaService.role.count({
      where: { deletedAt: null },
    })
    const $getPaginatedList = this.prismaService.role.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
    })
    const [totalItems, data] = await Promise.all([$countTotalItems, $getPaginatedList])
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, data, limit, page, totalPages }
  }

  async findById(id: number): Promise<RoleDetailsType | null> {
    return await this.prismaService.role.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null, // Only include not deleted permissions
          },
        },
      },
    })
  }

  async create({
    data,
    createdByUserId,
  }: {
    data: CreateRoleRequestBodyType
    createdByUserId: number
  }): Promise<CreateRoleResponseType> {
    return await this.prismaService.role.create({
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
    data: UpdateRoleRequestBodyType
    updatedByUserId: number
  }): Promise<RoleDetailsType> {
    const { name, isActive, description, permissionIds } = data
    return this.prismaService.role.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        name,
        isActive,
        description,
        updatedByUserId,
        // Update permissions related to role
        permissions: {
          set: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: {
          where: {
            deletedAt: null, // Only include not deleted permissions
          },
        },
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
  }): Promise<RoleType> {
    if (isHardDelete) {
      return await this.prismaService.role.delete({
        where: {
          id,
        },
      })
    }
    return await this.prismaService.role.update({
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
