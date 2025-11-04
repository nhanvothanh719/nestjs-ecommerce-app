import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

const PASSWORD_PATH = 'password'

export const NotFoundRecordException = () => new NotFoundException('Error.NotFound')
export const InvalidPasswordException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.InvalidPassword',
      path: PASSWORD_PATH,
    },
  ])
