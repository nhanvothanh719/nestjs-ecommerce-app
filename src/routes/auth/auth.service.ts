import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import { RegisterRequestBodyType, SendOTPRequestBodyType } from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { generateOTP, isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { VerificationCodeGenre } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterRequestBodyType) {
    try {
      const { password, email, name, phoneNumber, code } = body

      // Check verification code
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email,
        code,
        type: VerificationCodeGenre.REGISTER,
      })
      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            path: 'code',
            message: 'Invalid OTP code',
          },
        ])
      } else if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            path: 'code',
            message: 'OTP code is expired',
          },
        ])
      }

      const clientRoleId = await this.roleService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(password)
      const user = await this.authRepository.createUser({
        email,
        name,
        phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      })
      return user
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) {
        throw new UnprocessableEntityException([
          {
            path: 'email',
            message: 'Email already exists',
          },
        ])
      }
      throw error
    }
  }

  // async login(body: any) {
  //   const { email, password } = body

  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   })

  //   if (!user) throw new UnauthorizedException('Account does not exist')

  //   const isCorrectPassword = await this.hashingService.compare(password, user.password)
  //   if (!isCorrectPassword)
  //     throw new UnprocessableEntityException([
  //       {
  //         field: 'password',
  //         error: 'Incorrect password',
  //       },
  //     ])

  //   const tokens = await this.generateAccessAndRefreshTokens({ userId: user.id })
  //   return tokens
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     return { message: 'Logout successfully' }
  //   } catch (error) {
  //     if (isPrismaNotFoundError(error)) throw new UnauthorizedException('Invalid refresh token')
  //     throw new UnauthorizedException()
  //   }
  // }

  // async generateAccessAndRefreshTokens(payload: { userId: number }) {
  //   // Generate access and refresh token
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenService.signAccessToken(payload),
  //     this.tokenService.signRefreshToken(payload),
  //   ])

  //   // Store refresh token in db
  //   const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
  //   await this.prismaService.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: payload.userId,
  //       expiresAt: new Date(decodedRefreshToken.exp * 1000),
  //     },
  //   })

  //   return { accessToken, refreshToken }
  // }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     // Check refresh token
  //     const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: { token: refreshToken },
  //     })

  //     // Delete stored refresh token
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     // Create new access token and refresh token
  //     return await this.generateAccessAndRefreshTokens({ userId })
  //   } catch (error) {
  //     if (isPrismaNotFoundError(error)) throw new UnauthorizedException('Invalid refresh token')
  //     throw new UnauthorizedException()
  //   }
  // }

  async sendOTP(body: SendOTPRequestBodyType) {
    const { email, type } = body
    const user = await this.sharedUserRepository.findUnique({ email })
    if (user) {
      throw new UnprocessableEntityException([
        {
          path: 'email',
          message: 'Email already exists',
        },
      ])
    }

    const code = generateOTP()
    const verificationCode = await this.authRepository.createVerificationCode({
      email,
      type,
      code,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as ms.StringValue)),
    })

    // Send email with verification code
    const { error } = await this.emailService.sendVerificationCodeMailWithReactEmail({
      email,
      code: verificationCode.code,
    })
    if (error) {
      console.error('>>> Send mail error: ', error)
      throw new UnprocessableEntityException([
        {
          path: 'code',
          message: 'Fail to send email with verification code',
        },
      ])
    }

    return verificationCode
  }
}
