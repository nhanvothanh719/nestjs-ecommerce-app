import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateUserRequestBodyDTO,
  CreateUserResponseDTO,
  GetPaginatedUsersListRequestQueryDTO,
  GetPaginatedUsersListResponseDTO,
  GetUserRequestParamsDTO,
  UpdateUserRequestBodyDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { ActiveUserRoleWithPermissions } from 'src/shared/decorators/active-user-role-permissions.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'
import { GetUserProfileResponseDTO, UpdateUserProfileResponseDTO } from 'src/shared/dtos/user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodResponse({ type: GetPaginatedUsersListResponseDTO })
  getAll(@Query() query: GetPaginatedUsersListRequestQueryDTO) {
    return this.userService.getPaginatedList(query)
  }

  @Get(':id')
  @ZodResponse({ type: GetUserProfileResponseDTO })
  findById(@Param() params: GetUserRequestParamsDTO) {
    return this.userService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: CreateUserResponseDTO })
  create(
    @Body() body: CreateUserRequestBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUserRoleWithPermissions('name') roleName: string,
  ) {
    return this.userService.create({
      data: body,
      createdByUserId: userId,
      createdByRoleName: roleName,
    })
  }

  @Put(':id')
  @ZodResponse({ type: UpdateUserProfileResponseDTO })
  update(
    @Body() body: UpdateUserRequestBodyDTO,
    @Param() params: GetUserRequestParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUserRoleWithPermissions('name') roleName: string,
  ) {
    return this.userService.update({
      id: params.id,
      data: body,
      updatedByUserId: userId,
      updatedByRoleName: roleName,
    })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  delete(
    @Param() params: GetUserRequestParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveUserRoleWithPermissions('name') roleName: string,
  ) {
    return this.userService.delete({
      id: params.id,
      deletedByRoleName: roleName,
      updatedByUserId: userId,
    })
  }
}
