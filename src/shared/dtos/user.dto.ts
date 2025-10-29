import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResponseSchema, UpdateUserProfileResponseSchema } from 'src/shared/models/user.model'

export class GetUserProfileResponseDTO extends createZodDto(GetUserProfileResponseSchema) {}
export class UpdateUserProfileResponseDTO extends createZodDto(UpdateUserProfileResponseSchema) {}
