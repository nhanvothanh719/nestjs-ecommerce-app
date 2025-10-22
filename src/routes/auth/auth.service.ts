import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { RoleService } from 'src/routes/auth/role.service'
import { isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
  ) {}

  async register(body: any) {
    try {
      const { password, email, name, phoneNumber } = body
      const clientRoleId = await this.roleService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(password)
      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phoneNumber,
          roleId: clientRoleId,
        },
        omit: {
          password: true,
          totpSecret: true,
        },
      })
      return user
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) throw new ConflictException('Email has already existed')
      throw error
    }
  }

  async login(body: any) {
    const { email, password } = body

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) throw new UnauthorizedException('Account does not exist')

    const isCorrectPassword = await this.hashingService.compare(password, user.password)
    if (!isCorrectPassword)
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Incorrect password',
        },
      ])

    const tokens = await this.generateAccessAndRefreshTokens({ userId: user.id })
    return tokens
  }

  async logout(refreshToken: string) {
    try {
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return { message: 'Logout successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw new UnauthorizedException('Invalid refresh token')
      throw new UnauthorizedException()
    }
  }

  async generateAccessAndRefreshTokens(payload: { userId: number }) {
    // Generate access and refresh token
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    // Store refresh token in db
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Check refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      })

      // Delete stored refresh token
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      // Create new access token and refresh token
      return await this.generateAccessAndRefreshTokens({ userId })
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw new UnauthorizedException('Invalid refresh token')
      throw new UnauthorizedException()
    }
  }
}
