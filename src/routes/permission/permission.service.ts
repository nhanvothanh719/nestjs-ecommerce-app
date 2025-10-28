import { Injectable } from '@nestjs/common'
import { AlreadyExistedPermissionException } from 'src/routes/permission/permission.error'
import {
  CreatePermissionRequestBodyType,
  GetPermissionsListRequestQueryType,
  GetPermissionsListResponseType,
  PermissionDetailsType,
  UpdatePermissionRequestBodyType,
} from 'src/routes/permission/permission.model'
import { PermissionRepository } from 'src/routes/permission/permission.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getPaginatedList(paginationData: GetPermissionsListRequestQueryType): Promise<GetPermissionsListResponseType> {
    return await this.permissionRepository.getPaginatedList(paginationData)
  }

  async findById(id: number): Promise<PermissionDetailsType> {
    const permission = await this.permissionRepository.findById(id)
    if (!permission) throw NotFoundRecordException
    return permission
  }

  async create(payload: {
    data: CreatePermissionRequestBodyType
    createdByUserId: number
  }): Promise<PermissionDetailsType> {
    try {
      const permission = await this.permissionRepository.create(payload)
      return permission
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedPermissionException
      throw error
    }
  }

  async update(payload: {
    id: number
    data: UpdatePermissionRequestBodyType
    updatedByUserId: number
  }): Promise<PermissionDetailsType> {
    try {
      const permission = await this.permissionRepository.update(payload)
      return permission
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedPermissionException
      throw error
    }
  }

  async delete(payload: { id: number; updatedByUserId: number }): Promise<ResponseMessageType> {
    try {
      await this.permissionRepository.delete(payload)
      return { message: 'Delete permission successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
