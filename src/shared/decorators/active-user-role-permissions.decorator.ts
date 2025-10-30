import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { REQUEST_USER_ROLE_PERMISSIONS_KEY } from 'src/shared/constants/auth.constant'
import { RoleWithPermissionsType } from 'src/shared/models/role.model'

// MEMO: @ActiveUserRoleWithPermissions('role') => key='role'
export const ActiveUserRoleWithPermissions = createParamDecorator(
  (field: keyof RoleWithPermissionsType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const roleWithPermissions: RoleWithPermissionsType | undefined = request[REQUEST_USER_ROLE_PERMISSIONS_KEY]
    return field ? roleWithPermissions?.[field] : roleWithPermissions
  },
)
