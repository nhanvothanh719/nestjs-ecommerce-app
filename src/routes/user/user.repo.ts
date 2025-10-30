import { Injectable } from '@nestjs/common'
import {
  CreateUserRequestBodyType,
  GetPaginatedUsersListRequestQueryType,
  GetPaginatedUsersListResponseType,
} from 'src/routes/user/user.model'
import { UserType } from 'src/shared/models/user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPaginatedList({
    limit,
    page,
  }: GetPaginatedUsersListRequestQueryType): Promise<GetPaginatedUsersListResponseType> {
    const skip = (page - 1) * limit
    const $countTotalUsers = this.prismaService.user.count({
      where: { deletedAt: null },
    })
    const $getPaginatedUsersList = this.prismaService.user.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    })
    const [totalItems, data] = await Promise.all([$countTotalUsers, $getPaginatedUsersList])
    const totalPages = Math.ceil(totalItems / limit)

    return { totalItems, limit, page, totalPages, data }
  }

  async create({
    data,
    createdByUserId,
  }: {
    data: CreateUserRequestBodyType
    createdByUserId: number | null
  }): Promise<UserType> {
    return this.prismaService.user.create({
      data: {
        ...data,
        createdByUserId,
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
  }): Promise<UserType> {
    if (isHardDelete) {
      return this.prismaService.user.delete({
        where: {
          id,
        },
      })
    }
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        updatedByUserId,
      },
    })
  }
}
