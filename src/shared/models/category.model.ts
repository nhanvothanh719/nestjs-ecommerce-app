import { CategoryTranslationSchema } from 'src/shared/models/category-translation.model'
import * as z from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().max(500),
  logo: z.url().nullable(),
  parentCategoryId: z.number().nullable(),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CategoryWithTranslationsSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema),
})

export type CategoryType = z.infer<typeof CategorySchema>
export type CategoryWithTranslationsType = z.infer<typeof CategoryWithTranslationsSchema>
