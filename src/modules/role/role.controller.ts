import { Body, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiController } from "src/decorators/customDecorator";
import { RoleService } from "./role.service";
import { IPromiseApiResponse } from "src/types/commonType";
import { TblRole } from "src/entities/TblRole.entity";
import { CreateRoleDto } from "./role.dto";

@ApiController("role")
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get()
  async getAll(): IPromiseApiResponse<[TblRole[], number]> {
    return { data: await this.roleService.findAllAndCount() };
  }

  @Post("create")
  async create(@Body() body: CreateRoleDto): IPromiseApiResponse<TblRole> {
    return { data: await this.roleService.create(body) };
  }

  @Post("update/:id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: CreateRoleDto,
  ): IPromiseApiResponse<TblRole> {
    return { data: await this.roleService.update(id, body) };
  }

  @Delete("delete/:id")
  async delete(
    @Param("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<boolean> {
    return { data: await this.roleService.remove(id) };
  }
}
