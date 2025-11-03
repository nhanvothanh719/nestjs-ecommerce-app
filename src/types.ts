/* eslint-disable @typescript-eslint/no-namespace */
import { ProductTranslationType } from 'src/shared/models/product-translation.model'
import { VariantsListType } from 'src/shared/models/product.model'

// Document: https://www.npmjs.com/package/prisma-json-types-generator
declare global {
  namespace PrismaJson {
    type CustomVariantsListType = VariantsListType
    type SKUSnapshotProductTranslations = Pick<
      ProductTranslationType,
      'id' | 'productId' | 'name' | 'description' | 'languageId'
    >[]
    type Receiver = {
      name: string
      phoneNumber: string
      address: string
    }
  }
}
