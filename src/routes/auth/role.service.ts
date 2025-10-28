import { Injectable } from '@nestjs/common'
import { RoleName } from 'src/shared/constants/role.constant'
import { RoleType } from 'src/shared/models/role.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleService {
  // Store caching value
  private clientRoleId: number | null = null

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get id of role client
   * @returns Promise<number>
   */
  async getClientRoleId(): Promise<number> {
    // If `clientRoleId` has value <=> `clientRoleId` is cached
    if (this.clientRoleId) return this.clientRoleId

    const clientRole: RoleType = await this.prismaService.$queryRaw`
      SELECT * FROM "Role" 
      WHERE name = ${RoleName.Client} AND "deletedAt" IS NULL 
      LIMIT 1;
    `.then((res: RoleType[]) => {
      if (res.length === 0) throw new Error('Cannot find client role ID')
      return res[0]
    })
    this.clientRoleId = clientRole.id

    return clientRole.id
  }
}
