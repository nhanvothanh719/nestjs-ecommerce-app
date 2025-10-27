import * as z from 'zod'

export const EmptyRequestBodySchema = z.object({}).strict()

export type EmptyRequestBodyType = z.infer<typeof EmptyRequestBodySchema>
