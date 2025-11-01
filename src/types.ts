/* eslint-disable @typescript-eslint/no-namespace */
import { VariantsListType } from 'src/routes/product/product.model'

// Document: https://www.npmjs.com/package/prisma-json-types-generator
declare global {
  namespace PrismaJson {
    type CustomVariantsListType = VariantsListType
  }
}
