import { Injectable } from '@nestjs/common'
import { RoleType } from 'src/routes/auth/auth.model'
import { RoleName } from 'src/shared/constants/role.constant'
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
  async getClientRoleId() {
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

    return this.clientRoleId
  }
}
