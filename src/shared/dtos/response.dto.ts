import { createZodDto } from 'nestjs-zod'
import { ResponseMessageSchema } from 'src/shared/models/response.model'

export class ResponseMessageDTO extends createZodDto(ResponseMessageSchema) {}
