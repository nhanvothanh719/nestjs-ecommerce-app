import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

const EMAIL_PATH = 'email'
const ROLE_ID_PATH = 'roleId'

export const AlreadyExistedUserException = new UnprocessableEntityException([
  {
    message: 'Error.AlreadyExistedUser',
    path: EMAIL_PATH,
  },
])

export const CannotUpdateAdminUserException = new ForbiddenException('Error.CannotUpdateAdminUser')

export const CannotDeleteAdminUserException = new ForbiddenException('Error.CannotDeleteAdminUser')

export const CannotSetAdminRoleToUserException = new ForbiddenException('Error.CannotSetAdminRoleToUser')

export const NotFoundRoleException = new UnprocessableEntityException([
  {
    message: 'Error.NotFoundRole',
    path: ROLE_ID_PATH,
  },
])

export const CannotUpdateOrDeleteYourselfException = new ForbiddenException('Error.CannotUpdateOrDeleteYourself')
