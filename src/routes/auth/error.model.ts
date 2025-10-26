import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

const VERIFICATION_CODE_PATH = 'verification_code'
const EMAIL_PATH = 'email'
const PASSWORD_PATH = 'password'
const TOTP_PATH = 'totpCode'

// Verification code related errors
export const InvalidVerificationCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidVerificationCode',
    path: VERIFICATION_CODE_PATH,
  },
])
export const ExpiredVerificationCodeException = new UnprocessableEntityException([
  {
    message: 'Error.ExpiredVerificationCode',
    path: VERIFICATION_CODE_PATH,
  },
])
export const FailedToSendVerificationCodeException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSendVerificationCode',
    path: VERIFICATION_CODE_PATH,
  },
])

// Email related errors
export const ExistedEmailException = new UnprocessableEntityException([
  {
    message: 'Error.ExistedEmail',
    path: EMAIL_PATH,
  },
])
export const NotFoundEmailException = new UnprocessableEntityException([
  {
    message: 'Error.NotFoundEmail',
    path: EMAIL_PATH,
  },
])

// Password related errors
export const InvalidPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidPassword',
    path: PASSWORD_PATH,
  },
])

// Access - refresh token related errors
export const InvalidRefreshTokenException = new UnauthorizedException('Error. InvalidRefreshToken')
export const UnauthorizedAccessException = new UnauthorizedException('Error.UnauthorizedAccess')

// Google auth related errors
export const FailedToGetUserInfoGoogleError = new Error('Error.FailedToGetUserInfoGoogle')
export const FailedToLoginGoogleError = new Error('Error.FailedToLoginGoogle')

// 2FA related errors
export const AlreadyEnabled2FAException = new UnprocessableEntityException([
  {
    message: 'Error.AlreadyEnabled2FA',
    path: TOTP_PATH,
  },
])
export const NotEnabled2FAException = new UnprocessableEntityException([
  {
    message: 'Error.NotEnabled2FA',
    path: TOTP_PATH,
  },
])
export const InvalidTOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTP',
    path: TOTP_PATH,
  },
])
export const InvalidTOTPAndLoginVerificationCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOTP',
    path: TOTP_PATH,
  },
  {
    message: 'Error.InvalidVerificationCode',
    path: VERIFICATION_CODE_PATH,
  },
])
