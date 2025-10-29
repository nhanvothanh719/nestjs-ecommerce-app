import { Injectable } from '@nestjs/common'
import { UserType } from 'src/shared/models/user.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { UserWithRoleAndPermissionsType } from 'src/shared/types/user.type'

type WhereUniqueUserType =
  | {
      id: number
      [key: string]: any
    }
  | {
      email: string
      [key: string]: any
    }

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where,
    })
  }

  findUniqueWithRoleAndPermissionsIncluded(where: WhereUniqueUserType): Promise<UserWithRoleAndPermissionsType | null> {
    return this.prismaService.user.findUnique({
      where,
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    })
  }

  update(where: WhereUniqueUserType, data: Partial<UserType>): Promise<UserType | null> {
    return this.prismaService.user.update({
      where,
      data,
    })
  }
}
