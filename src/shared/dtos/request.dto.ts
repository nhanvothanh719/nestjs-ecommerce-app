import { createZodDto } from 'nestjs-zod'
import { EmptyRequestBodySchema } from 'src/shared/models/request.model'

export class EmptyRequestBodyDTO extends createZodDto(EmptyRequestBodySchema) {}
