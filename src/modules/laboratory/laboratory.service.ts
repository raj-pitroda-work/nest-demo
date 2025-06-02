import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblLaboratory } from "src/entities/TblLaboratory.entity";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";

@Injectable()
export class LaboratoryService extends BaseService<TblLaboratory> {
  constructor(
    @InjectRepository(TblLaboratory)
    public labRepo: Repository<TblLaboratory>,
  ) {
    super(labRepo);
  }
}
