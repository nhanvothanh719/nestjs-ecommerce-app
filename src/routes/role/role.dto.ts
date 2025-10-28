import { createZodDto } from 'nestjs-zod'
import {
  CreateRoleRequestBodySchema,
  CreateRoleResponseSchema,
  GetRoleRequestParamsSchema,
  GetRolesListRequestQuerySchema,
  GetRolesListResponseSchema,
  RoleDetailsSchema,
  UpdateRoleRequestBodySchema,
} from 'src/routes/role/role.model'

export class GetRolesListRequestQueryDTO extends createZodDto(GetRolesListRequestQuerySchema) {}
export class GetRolesListResponseDTO extends createZodDto(GetRolesListResponseSchema) {}
export class GetRoleRequestParamsDTO extends createZodDto(GetRoleRequestParamsSchema) {}
export class RoleDetailsDTO extends createZodDto(RoleDetailsSchema) {}
export class CreateRoleRequestBodyDTO extends createZodDto(CreateRoleRequestBodySchema) {}
export class CreateRoleResponseDTO extends createZodDto(CreateRoleResponseSchema) {}
export class UpdateRoleRequestBodyDTO extends createZodDto(UpdateRoleRequestBodySchema) {}
