import { Injectable } from '@nestjs/common'
import { RoleName } from 'src/shared/constants/role.constant'
import { RoleType } from 'src/shared/models/role.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedRoleRepository {
  // Store caching value
  private clientRoleId: number | null = null
  private adminRoleId: number | null = null

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get id of role client
   * @returns Promise<number>
   */
  async getClientRoleId(): Promise<number> {
    // If `clientRoleId` has value <=> `clientRoleId` is cached
    if (this.clientRoleId) return this.clientRoleId
    const clientRole = await this.getRoleByName(RoleName.Client)

    this.clientRoleId = clientRole.id
    return clientRole.id
  }

  /**
   * Get id of role admin
   * @returns Promise<number>
   */
  async getAdminRoleId(): Promise<number> {
    if (this.adminRoleId) return this.adminRoleId
    const adminRole = await this.getRoleByName(RoleName.Admin)
    this.adminRoleId = adminRole.id

    return adminRole.id
  }

  private async getRoleByName(name: string) {
    const role: RoleType = await this.prismaService.$queryRaw`
      SELECT * FROM "Role" 
      WHERE name = ${name} AND "deletedAt" IS NULL 
      LIMIT 1;
    `.then((res: RoleType[]) => {
      if (res.length === 0) throw new Error('Cannot find client role ID')
      return res[0]
    })
    return role
  }
}
