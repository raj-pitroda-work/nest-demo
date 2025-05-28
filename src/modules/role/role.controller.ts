import { Get } from "@nestjs/common";
import { ApiController } from "src/decorators/customDecorator";
import { RoleService } from "./role.service";
import { IPromiseApiResponse } from "src/types/commonType";
import { TblRole } from "src/entities/TblRole.entity";

@ApiController("role")
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get()
  async getAll(): IPromiseApiResponse<[TblRole[], number]> {
    return { data: await this.roleService.getAll() };
  }
}
