import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblRole } from "src/entities/TblRole.entity";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";

@Injectable()
export class RoleService extends BaseService<TblRole> {
  constructor(@InjectRepository(TblRole) repo: Repository<TblRole>) {
    super(repo);
  }
}
