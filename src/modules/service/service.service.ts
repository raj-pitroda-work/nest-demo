import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { TblService } from "src/entities/TblService.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ServiceService extends BaseService<TblService> {
  constructor(
    @InjectRepository(TblService) public serviceRepo: Repository<TblService>,
  ) {
    super(serviceRepo);
  }
}
