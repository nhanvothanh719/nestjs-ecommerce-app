import { BrandTranslationSchema } from 'src/shared/models/brand-translation.model'
import * as z from 'zod'

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  logo: z.url(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const BrandWithTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export type BrandType = z.infer<typeof BrandSchema>
export type BrandWithTranslationsType = z.infer<typeof BrandWithTranslationsSchema>
