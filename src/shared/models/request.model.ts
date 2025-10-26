import z from 'zod'

export const EmptyRequestBodySchema = z.object({})

export type EmptyRequestBodyType = z.infer<typeof EmptyRequestBodySchema>
