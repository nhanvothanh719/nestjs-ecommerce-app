import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

const CODE_PATH = 'code'
const EMAIL_PATH = 'email'
const PASSWORD_PATH = 'password'

// Verification code related errors
export const InvalidOTPException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOTP',
    path: CODE_PATH,
  },
])

export const ExpiredOTPException = new UnprocessableEntityException([
  {
    message: 'Error.ExpiredOTP',
    path: CODE_PATH,
  },
])

export const FailedToSendOTPException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSendOTP',
    path: CODE_PATH,
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
