import { UnprocessableEntityException } from '@nestjs/common'

const ID_PATH = 'id'

export const AlreadyExistedLanguageException = new UnprocessableEntityException([
  {
    message: 'Error.AlreadyExistedLanguage',
    path: ID_PATH,
  },
])
