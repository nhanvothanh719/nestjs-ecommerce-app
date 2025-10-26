export const REQUEST_USER_KEY = 'user'

export const JWT_ALGORITHM = 'HS256'

export const TWO_FACTOR_AUTHENTICATION = {
  ISSUER: 'EcommerceNestApp',
  ALGORITHM: 'SHA1',
  DIGITS: 6,
  PERIOD: 30,
} as const

export const AuthType = {
  Bearer: 'Bearer',
  ApiKey: 'ApiKey',
  None: 'None',
} as const
export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType]

export const ConditionGuard = {
  And: 'And',
  Or: 'Or',
} as const
export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus]

export const VerificationCodeGenre = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
} as const
export type VerificationCodeGenreType = (typeof VerificationCodeGenre)[keyof typeof VerificationCodeGenre]
