import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import {
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
import { VerificationCodeGenre } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import { ResponseMessageType } from 'src/shared/models/response.model'

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

  async login(body: LoginRequestBodyType & { ip: string; userAgent: string }) {
    const { email, password, ip, userAgent } = body

    const user = await this.authRepository.findUniqueUserWithRoleIncluded({ email })

    if (!user)
      throw new UnprocessableEntityException([
        {
          path: 'email',
          message: 'Email does not exist',
        },
      ])

    const isCorrectPassword = await this.hashingService.compare(password, user.password)
    if (!isCorrectPassword)
      throw new UnprocessableEntityException([
        {
          path: 'password',
          message: 'Incorrect password',
        },
      ])

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
      throw new UnauthorizedException()
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
      deviceId: 1,
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

      if (!retrievedRefreshToken) throw new UnauthorizedException('Invalid refresh token')

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
      throw new UnauthorizedException()
    }
  }

  async sendOTP(body: SendOTPRequestBodyType): Promise<ResponseMessageType> {
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

    return { message: 'Send verification code successfully' }
  }
}
