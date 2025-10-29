import * as z from 'zod'

export const EmptyRequestBodySchema = z.object({}).strict()
export const GetPaginatedItemsListRequestQuerySchema = z
  .object({
    // MEMO: Sử dụng `.coerce` để chuyển từ string sang number
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
  })
  .strict()
export const BasePaginatedItemsListResponseSchema = z.object({
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export type EmptyRequestBodyType = z.infer<typeof EmptyRequestBodySchema>
export type GetPaginatedItemsListRequestQueryType = z.infer<typeof GetPaginatedItemsListRequestQuerySchema>
export type BasePaginatedItemsListResponseType = z.infer<typeof BasePaginatedItemsListResponseSchema>
