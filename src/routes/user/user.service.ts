import { ForbiddenException, Injectable } from '@nestjs/common'
import {
  AlreadyExistedUserException,
  CannotUpdateOrDeleteYourselfException,
  NotFoundRoleException,
} from 'src/routes/user/user.error'
import {
  CreateUserRequestBodyType,
  GetPaginatedUsersListRequestQueryType,
  GetPaginatedUsersListResponseType,
  UpdateUserRequestBodyType,
} from 'src/routes/user/user.model'
import { UserRepository } from 'src/routes/user/user.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import { NotFoundRecordException } from 'src/shared/error'
import {
  isPrismaForeignKeyConstraintError,
  isPrismaNotFoundError,
  isPrismaUniqueConstraintFailedError,
} from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'
import { UserType } from 'src/shared/models/user.model'
import { SharedRoleRepository } from 'src/shared/repositories/role.repo'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { UserWithRoleAndPermissionsType } from 'src/shared/types/user.type'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly hashingService: HashingService,
  ) {}

  getPaginatedList(paginationData: GetPaginatedUsersListRequestQueryType): Promise<GetPaginatedUsersListResponseType> {
    return this.userRepository.getPaginatedList(paginationData)
  }

  async findById(id: number): Promise<UserWithRoleAndPermissionsType> {
    const user = await this.sharedUserRepository.findUniqueWithRoleAndPermissionsIncluded({ id })
    if (!user) throw NotFoundRecordException()
    return user
  }

  async create({
    data,
    createdByUserId,
    createdByRoleName,
  }: {
    data: CreateUserRequestBodyType
    createdByUserId: number
    createdByRoleName: string
  }): Promise<UserType> {
    try {
      // Chỉ có Admin user mới có thể tạo 1 user mới với role Admin
      await this.checkCanActionOnUserWithAdminRole({
        agentRoleName: createdByRoleName,
        targetRoleId: data.roleId,
      })

      const hashedPassword = await this.hashingService.hash(data.password)

      const user = await this.userRepository.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        createdByUserId,
      })

      return user
    } catch (error) {
      if (isPrismaForeignKeyConstraintError(error)) throw NotFoundRoleException()
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedUserException()
      throw error
    }
  }

  async update({
    id,
    data,
    updatedByUserId,
    updatedByRoleName,
  }: {
    id: number
    data: UpdateUserRequestBodyType
    updatedByUserId: number
    updatedByRoleName: string
  }): Promise<UserType> {
    try {
      this.ensureNotSelfAction({ agentUserId: updatedByUserId, targetUserId: id })

      const targetRoleId = await this.getRoleIdByUserId(id)
      await this.checkCanActionOnUserWithAdminRole({ agentRoleName: updatedByRoleName, targetRoleId })

      const user = await this.sharedUserRepository.update({ id }, { ...data, updatedByUserId })
      if (!user) throw NotFoundRecordException()

      return user
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      if (isPrismaUniqueConstraintFailedError(error)) throw AlreadyExistedUserException()
      if (isPrismaForeignKeyConstraintError(error)) throw NotFoundRoleException()
      throw error
    }
  }

  async delete({
    id,
    deletedByRoleName,
    updatedByUserId,
  }: {
    id: number
    deletedByRoleName: string
    updatedByUserId: number
  }): Promise<ResponseMessageType> {
    try {
      this.ensureNotSelfAction({ agentUserId: updatedByUserId, targetUserId: id })

      const targetRoleId = await this.getRoleIdByUserId(id)
      await this.checkCanActionOnUserWithAdminRole({ agentRoleName: deletedByRoleName, targetRoleId })

      await this.userRepository.delete({ id, updatedByUserId })

      return { message: 'Delete user successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw NotFoundRecordException()
      throw error
    }
  }

  private async checkCanActionOnUserWithAdminRole({
    agentRoleName,
    targetRoleId,
  }: {
    agentRoleName: string
    targetRoleId: number
  }): Promise<boolean> {
    // Cho phép người dùng có vai trò Admin thực hiện thao tác
    if (agentRoleName === RoleName.Admin) return true

    const adminRoleId = await this.sharedRoleRepository.getAdminRoleId()
    // Chặn người dùng không phải Admin thực hiện thao tác trên user có vai trò Admin
    if (targetRoleId === adminRoleId) throw new ForbiddenException()

    return true
  }

  private ensureNotSelfAction({ agentUserId, targetUserId }: { agentUserId: number; targetUserId: number }) {
    if (agentUserId === targetUserId) throw CannotUpdateOrDeleteYourselfException()
  }

  private async getRoleIdByUserId(id: number): Promise<number> {
    const user = await this.sharedUserRepository.findUnique({ id })
    if (!user) throw NotFoundRecordException()
    return user.roleId
  }
}
