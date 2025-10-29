import { BadRequestException, Injectable } from '@nestjs/common'
import { AlreadyExistedRoleException, ProhibitedActionOnBaseRoleException } from 'src/routes/role/role.error'
import {
  CreateRoleRequestBodyType,
  CreateRoleResponseType,
  GetRolesListRequestQueryType,
  GetRolesListResponseType,
  RoleDetailsType,
  UpdateRoleRequestBodyType,
} from 'src/routes/role/role.model'
import { RoleRepository } from 'src/routes/role/role.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getPaginatedList(paginationData: GetRolesListRequestQueryType): Promise<GetRolesListResponseType> {
    return await this.roleRepository.getPaginatedList(paginationData)
  }

  async findById(id: number): Promise<RoleDetailsType> {
    const roleWithPermissions = await this.roleRepository.findById(id)
    if (!roleWithPermissions) throw NotFoundRecordException
    return roleWithPermissions
  }

  async create(payload: { data: CreateRoleRequestBodyType; createdByUserId: number }): Promise<CreateRoleResponseType> {
    try {
      const role = await this.roleRepository.create(payload)
      return role
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedRoleException
      throw error
    }
  }

  async update(payload: {
    id: number
    data: UpdateRoleRequestBodyType
    updatedByUserId: number
  }): Promise<RoleDetailsType> {
    try {
      await this.verifyRole(payload.id)

      const roleWithPermissions = await this.roleRepository.update(payload)
      return roleWithPermissions
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedRoleException
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      if (error instanceof Error) throw new BadRequestException(error.message)
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.verifyRole(payload.id)

      await this.roleRepository.delete(payload)
      return { message: 'Delete role successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }

  private async verifyRole(id: number) {
    const role = await this.roleRepository.findById(id)
    if (!role) throw NotFoundRecordException

    // MEMO: Không cho phép thao tác chỉnh sửa các role cơ bản
    const baseRoles: string[] = [RoleName.Admin, RoleName.Seller, RoleName.Client]
    if (baseRoles.includes(role.name)) {
      throw ProhibitedActionOnBaseRoleException
    }
  }
}
