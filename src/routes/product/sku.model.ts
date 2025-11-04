import { SKUSchema } from 'src/shared/models/sku.model'
import * as z from 'zod'

export const UpsertSKURequestBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
})

export type UpsertSKURequestBodyType = z.infer<typeof UpsertSKURequestBodySchema>
