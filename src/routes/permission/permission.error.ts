import { UnprocessableEntityException } from '@nestjs/common'

const PATH_PATH = 'path'
const METHOD_PATH = 'method'

export const AlreadyExistedPermissionException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.AlreadyExistedPermission',
      path: PATH_PATH,
    },
    {
      message: 'Error.AlreadyExistedPermission',
      path: METHOD_PATH,
    },
  ])
