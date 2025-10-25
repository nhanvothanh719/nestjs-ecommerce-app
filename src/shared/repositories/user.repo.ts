import { Injectable } from '@nestjs/common'
import { UserType } from 'src/shared/models/user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: { id: number } | { email: string }): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    })
  }
}
