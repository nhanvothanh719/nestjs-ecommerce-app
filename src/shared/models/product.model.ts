import * as z from 'zod'

export const VariantSchema = z.object({
  value: z.string().trim(),
  options: z.array(z.string().trim()),
})

export const VariantsListSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  const seenVariantValuesSet = new Set<string>()
  variants.forEach((variant) => {
    // Check duplicate variant values
    const modifiedVariantValue = variant.value.toLowerCase()
    if (seenVariantValuesSet.has(modifiedVariantValue)) {
      ctx.addIssue({
        code: 'custom',
        message: `${variant.value} has already existed in variants list`,
        path: ['variants'],
      })
    } else {
      seenVariantValuesSet.add(modifiedVariantValue)
    }

    // Check for duplicate options
    const seenVariantOptionsSet = new Set<string>()
    variant.options.forEach((option) => {
      const modifiedOption = option.toLowerCase()
      if (seenVariantOptionsSet.has(modifiedOption)) {
        ctx.addIssue({
          code: 'custom',
          message: `${variant.value} has duplicated options`,
          path: ['variants'],
        })
      } else {
        seenVariantOptionsSet.add(modifiedOption)
      }
    })
  })
})

export const ProductSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(),
  name: z.string().trim().min(1).max(500),
  basePrice: z.number().min(0),
  virtualPrice: z.number().min(0),
  brandId: z.number().positive(),
  images: z.array(z.string()),
  variants: VariantsListSchema,
  createdByUserId: z.number(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type VariantType = z.infer<typeof VariantSchema>
export type VariantsListType = z.infer<typeof VariantsListSchema>
export type ProductType = z.infer<typeof ProductSchema>
