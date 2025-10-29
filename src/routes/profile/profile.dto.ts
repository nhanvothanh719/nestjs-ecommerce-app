import { createZodDto } from 'nestjs-zod'
import { ChangePasswordRequestBodySchema, UpdateMyProfileRequestBodySchema } from 'src/routes/profile/profile.model'

export class UpdateMyProfileRequestBodyDTO extends createZodDto(UpdateMyProfileRequestBodySchema) {}
export class ChangePasswordRequestBodyDTO extends createZodDto(ChangePasswordRequestBodySchema) {}
