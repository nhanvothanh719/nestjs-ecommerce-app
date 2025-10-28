import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import {
  CreatePermissionRequestBodyDTO,
  GetPermissionRequestParamsDTO,
  GetPermissionsListRequestQueryDTO,
  GetPermissionsListResponseDTO,
  PermissionDetailsDTO,
  UpdatePermissionRequestBodyDTO,
} from 'src/routes/permission/permission.dto'
import { PermissionService } from 'src/routes/permission/permission.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodResponse({ type: GetPermissionsListResponseDTO })
  async getAll(@Query() query: GetPermissionsListRequestQueryDTO) {
    return await this.permissionService.getPaginatedList(query)
  }

  @Get(':id')
  @ZodResponse({ type: PermissionDetailsDTO })
  async getById(@Param() params: GetPermissionRequestParamsDTO) {
    return await this.permissionService.findById(params.id)
  }

  @Post()
  @ZodResponse({ type: PermissionDetailsDTO })
  async create(@Body() body: CreatePermissionRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return await this.permissionService.create({ data: body, createdByUserId: userId })
  }

  @Put(':id')
  @ZodResponse({ type: PermissionDetailsDTO })
  async update(
    @Param() params: GetPermissionRequestParamsDTO,
    @Body() body: UpdatePermissionRequestBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return await this.permissionService.update({ id: params.id, updatedByUserId: userId, data: body })
  }

  @Delete(':id')
  @ZodResponse({ type: ResponseMessageDTO })
  async delete(@Param() params: GetPermissionRequestParamsDTO, @ActiveUser('userId') userId: number) {
    return await this.permissionService.delete({ id: params.id, updatedByUserId: userId })
  }
}
