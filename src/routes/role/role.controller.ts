import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateRoleRequestBodyDTO,
  CreateRoleResponseDTO,
  GetRoleRequestParamsDTO,
  GetRolesListRequestQueryDTO,
  GetRolesListResponseDTO,
  RoleDetailsDTO,
  UpdateRoleRequestBodyDTO,
} from 'src/routes/role/role.dto'
import { RoleService } from 'src/routes/role/role.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodResponse({ type: GetRolesListResponseDTO })
  async getAll(@Query() query: GetRolesListRequestQueryDTO) {
    return await this.roleService.getPaginatedList(query)
  }

  @Get(':id')
  @ZodResponse({ type: RoleDetailsDTO })
  async getById(@Param() params: GetRoleRequestParamsDTO) {
    return await this.roleService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: CreateRoleResponseDTO })
  async create(@Body() body: CreateRoleRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return await this.roleService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: RoleDetailsDTO })
  async update(
    @Param() params: GetRoleRequestParamsDTO,
    @Body() body: UpdateRoleRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return await this.roleService.update({ id: params.id, updatedByUserId: userId, data: body })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  async delete(@Param() params: GetRoleRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return await this.roleService.delete({ id: params.id, updatedByUserId: userId })
  }
}
