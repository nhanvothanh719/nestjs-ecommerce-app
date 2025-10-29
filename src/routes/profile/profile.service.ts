import { Injectable, NotFoundException } from '@nestjs/common'
import { ChangePasswordRequestBodyType, UpdateMyProfileRequestBodyType } from 'src/routes/profile/profile.model'
import { InvalidPasswordException, NotFoundRecordException } from 'src/shared/error'
import { isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { ResponseMessageType } from 'src/shared/models/response.model'
import { UserType } from 'src/shared/models/user.model'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { UserWithRoleAndPermissionsType } from 'src/shared/types/user.type'

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async getUserProfile(id: number): Promise<UserWithRoleAndPermissionsType> {
    const user = await this.sharedUserRepository.findUniqueWithRoleAndPermissionsIncluded({
      id,
      deletedAt: null,
    })
    if (!user) throw NotFoundException
    return user
  }

  async updateUserProfile({ id, data }: { id: number; data: UpdateMyProfileRequestBodyType }): Promise<UserType> {
    try {
      const user = await this.sharedUserRepository.update({ id, deletedAt: null }, { ...data, updatedByUserId: id })
      if (!user) throw NotFoundRecordException
      return user
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw NotFoundRecordException
      throw error
    }
  }

  async changePassword({
    id,
    data,
  }: {
    id: number
    data: Omit<ChangePasswordRequestBodyType, 'confirmNewPassword'>
  }): Promise<ResponseMessageType> {
    try {
      const { password, newPassword } = data
      const user = await this.sharedUserRepository.findUnique({ id, deletedAt: null })
      if (!user) throw NotFoundException

      // Check password
      const isCorrectPassword = await this.hashingService.compare(password, user.password)
      if (!isCorrectPassword) throw InvalidPasswordException
      const newHashedPassword = await this.hashingService.hash(newPassword)

      // Change password
      await this.sharedUserRepository.update(
        { id, deletedAt: null },
        { password: newHashedPassword, updatedByUserId: id },
      )

      return { message: 'Update password successfully' }
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw NotFoundRecordException
      throw error
    }
  }
}
