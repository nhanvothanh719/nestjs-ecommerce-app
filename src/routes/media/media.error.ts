import { UnprocessableEntityException } from '@nestjs/common'
import { FIELD_NAME } from 'src/shared/constants/media.constant'

const FILES_PATH = FIELD_NAME

export const RequiredFileException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.RequiredFile',
      path: FILES_PATH,
    },
  ])
