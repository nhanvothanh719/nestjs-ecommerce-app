import { PermissionType } from 'src/shared/models/permission.model'
import { RoleType } from 'src/shared/models/role.model'
import { UserType } from 'src/shared/models/user.model'

export type UserWithRoleAndPermissionsType = UserType & {
  role: RoleType & {
    permissions: PermissionType[]
  }
}

export type WhereUniqueUserType = { id: number } | { email: string }
