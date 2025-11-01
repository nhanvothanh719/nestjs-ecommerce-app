import { UnprocessableEntityException } from '@nestjs/common'

const LANGUAGE_ID_PATH = 'languageId'
const CATEGORY_ID_PATH = 'categoryId'

export const AlreadyExistedCategoryTranslationException = new UnprocessableEntityException([
  {
    path: LANGUAGE_ID_PATH,
    message: 'Error.AlreadyExistedCategoryTranslation',
  },
])

export const NotExistedCategoryOrLanguageException = new UnprocessableEntityException([
  {
    message: 'Error.NotExistedCategoryOrLanguage',
    path: LANGUAGE_ID_PATH,
  },
  {
    message: 'Error.NotExistedCategoryOrLanguage',
    path: CATEGORY_ID_PATH,
  },
])
