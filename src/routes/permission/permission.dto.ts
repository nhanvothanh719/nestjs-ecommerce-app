import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionRequestBodySchema,
  GetPermissionRequestParamsSchema,
  GetPermissionsListRequestQuerySchema,
  GetPermissionsListResponseSchema,
  PermissionDetailsSchema,
  UpdatePermissionRequestBodySchema,
} from 'src/routes/permission/permission.model'

export class GetPermissionsListRequestQueryDTO extends createZodDto(GetPermissionsListRequestQuerySchema) {}
export class GetPermissionsListResponseDTO extends createZodDto(GetPermissionsListResponseSchema) {}
export class GetPermissionRequestParamsDTO extends createZodDto(GetPermissionRequestParamsSchema) {}
export class PermissionDetailsDTO extends createZodDto(PermissionDetailsSchema) {}
export class CreatePermissionRequestBodyDTO extends createZodDto(CreatePermissionRequestBodySchema) {}
export class UpdatePermissionRequestBodyDTO extends createZodDto(UpdatePermissionRequestBodySchema) {}
