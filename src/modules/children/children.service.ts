import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblChildren } from "src/entities/TblChildren.entity";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";

@Injectable()
export class ChildrenService extends BaseService<TblChildren> {
  constructor(
    @InjectRepository(TblChildren)
    public childRepo: Repository<TblChildren>,
  ) {
    super(childRepo);
  }
}
