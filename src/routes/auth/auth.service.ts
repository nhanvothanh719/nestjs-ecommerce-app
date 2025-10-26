import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import {
  ForgotPasswordRequestBodyType,
  LoginRequestBodyType,
  RefreshTokenRequestBodyType,
  RegisterRequestBodyType,
  SendOTPRequestBodyType,
} from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { generateOTP, isPrismaNotFoundError, isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { VerificationCodeGenre, VerificationCodeGenreType } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import { ResponseMessageType } from 'src/shared/models/response.model'
import {
  ExistedEmailException,
  ExpiredVerificationCodeException,
  FailedToSendVerificationCodeException,
  InvalidVerificationCodeException,
  InvalidPasswordException,
  InvalidRefreshTokenException,
  NotFoundEmailException,
  UnauthorizedAccessException,
} from 'src/routes/auth/error.model'

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
      await this.verifyVerificationCode({ email, code, type: VerificationCodeGenre.REGISTER })

      const clientRoleId = await this.roleService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(password)

      const $createUser = this.authRepository.createUser({
        email,
        name,
        phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      })
      const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
        email_code_type: {
          email,
          code,
          type: VerificationCodeGenre.REGISTER,
        },
      })
      const [user] = await Promise.all([$createUser, $deleteVerificationCode])
      return user
    } catch (error) {
      if (isPrismaUniqueConstraintFailedError(error)) {
        throw ExistedEmailException
      }
      throw error
    }
  }

  async login(body: LoginRequestBodyType & { ip: string; userAgent: string }) {
    const { email, password, ip, userAgent } = body

    const user = await this.authRepository.findUniqueUserWithRoleIncluded({ email })

    if (!user) throw NotFoundEmailException

    const isCorrectPassword = await this.hashingService.compare(password, user.password)
    if (!isCorrectPassword) throw InvalidPasswordException

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent,
      ip,
    })

    const tokens = await this.generateAccessAndRefreshTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    })
    return tokens
  }

  async logout(refreshToken: string): Promise<ResponseMessageType> {
    try {
      // Verify refresh token
      await this.tokenService.verifyRefreshToken(refreshToken)

      // Delete refresh token
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })

      // Update device as logout
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, { isActive: false })

      return { message: 'Logout successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) throw new UnauthorizedException('Invalid refresh token')
      throw UnauthorizedAccessException
    }
  }

  async generateAccessAndRefreshTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    // Generate access and refresh token
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ userId, deviceId, roleId, roleName }),
      this.tokenService.signRefreshToken({ userId }),
    ])

    // Store refresh token in db
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId,
    })

    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenRequestBodyType & { ip: string; userAgent: string }) {
    try {
      // Check refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      const retrievedRefreshToken = await this.authRepository.findUniqueRefreshTokenWithUserRoleIncluded({
        token: refreshToken,
      })

      if (!retrievedRefreshToken) throw InvalidRefreshTokenException

      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName },
        },
      } = retrievedRefreshToken

      // Update device
      const $updateDevice = this.authRepository.updateDevice(deviceId, { ip, userAgent })

      // Delete stored refresh token
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })

      // Create new access token and refresh token
      const $generateAccessTokenAndRefreshToken = this.generateAccessAndRefreshTokens({
        userId,
        roleId,
        roleName,
        deviceId,
      })

      const [, , generateAccessTokenAndRefreshTokenResult] = await Promise.all([
        $updateDevice,
        $deleteRefreshToken,
        $generateAccessTokenAndRefreshToken,
      ])

      return generateAccessTokenAndRefreshTokenResult
    } catch (error) {
      if (error instanceof HttpException) throw error
      throw UnauthorizedAccessException
    }
  }

  async sendOTP(body: SendOTPRequestBodyType): Promise<ResponseMessageType> {
    const { email, type } = body
    const user = await this.sharedUserRepository.findUnique({ email })

    if (type === VerificationCodeGenre.REGISTER && user) throw ExistedEmailException
    if (type === VerificationCodeGenre.FORGOT_PASSWORD && !user) throw NotFoundEmailException

    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email,
      type,
      code,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as ms.StringValue)),
    })

    // Send email with verification code
    const { error } = await this.emailService.sendVerificationCodeMailWithReactEmail({
      email,
      code,
    })
    if (error) {
      console.log(error)
      throw FailedToSendVerificationCodeException
    }

    return { message: 'Send verification code successfully' }
  }

  async forgotPassword(body: ForgotPasswordRequestBodyType) {
    const { email, code, newPassword } = body
    // Check email
    const user = await this.sharedUserRepository.findUnique({
      email,
    })
    if (!user) throw NotFoundEmailException

    // Check verification code
    await this.verifyVerificationCode({
      email,
      code,
      type: VerificationCodeGenre.FORGOT_PASSWORD,
    })

    // Apply new password & Delete verification code after verifying
    const hashedPassword = await this.hashingService.hash(newPassword)

    const $updateUser = this.authRepository.updateUser({ email }, { password: hashedPassword })
    const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
      email_code_type: {
        email,
        code,
        type: VerificationCodeGenre.FORGOT_PASSWORD,
      },
    })
    await Promise.all([$updateUser, $deleteVerificationCode])

    return { message: 'Change password successfully' }
  }

  private async verifyVerificationCode({
    email,
    code,
    type,
  }: {
    email: string
    code: string
    type: VerificationCodeGenreType
  }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: { email, code, type },
    })

    if (!verificationCode) throw InvalidVerificationCodeException

    if (verificationCode.expiresAt < new Date()) throw ExpiredVerificationCodeException

    return verificationCode
  }
}
