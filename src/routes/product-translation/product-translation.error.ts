import { UnprocessableEntityException } from '@nestjs/common'

const PRODUCT_ID_PATH = 'productId'

export const AlreadyExistedProductTranslationException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.AlreadyExistedProductTranslation',
      path: PRODUCT_ID_PATH,
    },
  ])
