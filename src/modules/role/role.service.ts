import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblRole } from "src/entities/TblRole.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
  constructor(@InjectRepository(TblRole) private repo: Repository<TblRole>) {}

  getAll = async () => {
    return await this.repo.findAndCount();
  };
}
