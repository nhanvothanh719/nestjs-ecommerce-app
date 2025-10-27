import * as z from 'zod'

export const LanguageSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(100),
  createdByUserId: z.number().nullable(),
  updatedByUserId: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const GetLanguagesListResponseSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number(),
})

export const GetLanguageRequestParamsSchema = z
  .object({
    id: z.string().max(10),
  })
  .strict()

export const LanguageDetailsSchema = LanguageSchema

export const CreateLanguageRequestBodySchema = z
  .object({
    id: z.string().max(10),
    name: z.string().max(100),
  })
  .strict()

export const UpdateLanguageRequestBodySchema = z
  .object({
    name: z.string().max(100),
  })
  .strict()

export type LanguageType = z.infer<typeof LanguageSchema>
export type GetLanguagesListResponseType = z.infer<typeof GetLanguagesListResponseSchema>
export type GetLanguageRequestParamsType = z.infer<typeof GetLanguageRequestParamsSchema>
export type LanguageDetailsType = z.infer<typeof LanguageDetailsSchema>
export type CreateLanguageRequestBodyType = z.infer<typeof CreateLanguageRequestBodySchema>
export type UpdateLanguageRequestBodyType = z.infer<typeof UpdateLanguageRequestBodySchema>
