import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedUserSocketRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findByUserId(userId: number) {
    return this.prismaService.userSocket.findMany({
      where: { userId },
    })
  }

  create({ socketId, userId }: { socketId: string; userId: number }) {
    return this.prismaService.userSocket.create({
      data: {
        id: socketId,
        userId,
      },
    })
  }

  delete(socketId: string) {
    return this.prismaService.userSocket.delete({
      where: { id: socketId },
    })
  }
}
