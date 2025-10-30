import { createZodDto } from 'nestjs-zod'
import {
  CreateUserRequestBodySchema,
  GetPaginatedUsersListRequestQueryParam,
  GetPaginatedUsersListResponseSchema,
  GetUserRequestParamsSchema,
  UpdateUserRequestBodySchema,
} from 'src/routes/user/user.model'
import { UpdateUserProfileResponseDTO } from 'src/shared/dtos/user.dto'

export class GetPaginatedUsersListRequestQueryDTO extends createZodDto(GetPaginatedUsersListRequestQueryParam) {}
export class GetPaginatedUsersListResponseDTO extends createZodDto(GetPaginatedUsersListResponseSchema) {}
export class GetUserRequestParamsDTO extends createZodDto(GetUserRequestParamsSchema) {}
export class CreateUserRequestBodyDTO extends createZodDto(CreateUserRequestBodySchema) {}
export class CreateUserResponseDTO extends UpdateUserProfileResponseDTO {}
export class UpdateUserRequestBodyDTO extends createZodDto(UpdateUserRequestBodySchema) {}
