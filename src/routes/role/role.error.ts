import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

const NAME_PATH = 'name'

export const AlreadyExistedRoleException = new UnprocessableEntityException([
  {
    message: 'Error.AlreadyExistedRole',
    name: NAME_PATH,
  },
])

export const ProhibitedActionOnBaseRoleException = new ForbiddenException('Error.ProhibitedActionOnBaseRole')
