import { Injectable } from '@nestjs/common'
import { DeviceType, RefreshTokenType, RoleType, VerificationCodeType } from 'src/routes/auth/auth.model'
import { VerificationCodeGenreType } from 'src/shared/constants/auth.constant'
import { UserType } from 'src/shared/models/user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'phoneNumber' | 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    })
  }

  createUserWithRoleIncluded(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'phoneNumber' | 'avatar' | 'roleId'>,
  ): Promise<UserType & { role: RoleType }> {
    return this.prismaService.user.create({
      data: user,
      include: { role: true },
    })
  }

  findUniqueUserWithRoleIncluded(
    uniqueObject: { id: number } | { email: string },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    })
  }

  updateUser(uniqueObject: { id: number } | { email: string }, data: Partial<Omit<UserType, 'id'>>): Promise<UserType> {
    return this.prismaService.user.update({
      where: uniqueObject,
      data,
    })
  }

  findUniqueRefreshTokenWithUserRoleIncluded(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    const { email, type, code } = payload
    return this.prismaService.verificationCode.upsert({
      where: {
        email_code_type: {
          email,
          code,
          type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    })
  }

  findUniqueVerificationCode(
    uniqueObject:
      | { id: number }
      | { email_code_type: { email: string; code: string; type: VerificationCodeGenreType } },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueObject,
    })
  }

  deleteVerificationCode(
    condition: { id: number } | { email_code_type: { email: string; code: string; type: VerificationCodeGenreType } },
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.delete({
      where: condition,
    })
  }

  createRefreshToken(data: {
    token: string
    userId: number
    expiresAt: Date
    deviceId: number
  }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.create({ data })
  }

  deleteRefreshToken(condition: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: condition,
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'isActive' | 'lastActive'>>,
  ) {
    return this.prismaService.device.create({ data })
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: { id: deviceId },
      data,
    })
  }
}
