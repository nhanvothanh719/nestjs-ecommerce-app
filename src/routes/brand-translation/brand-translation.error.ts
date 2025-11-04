import { UnprocessableEntityException } from '@nestjs/common'

const LANGUAGE_ID_PATH = 'languageId'
const BRAND_ID_PATH = 'brandId'

export const AlreadyExistedBrandTranslationException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.AlreadyExistedBrandTranslation',
      path: LANGUAGE_ID_PATH,
    },
  ])

export const NotExistedLanguageOrBrandException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.NotExistedLanguageOrBrand',
      path: LANGUAGE_ID_PATH,
    },
    {
      message: 'Error.NotExistedLanguageOrBrand',
      path: BRAND_ID_PATH,
    },
  ])
