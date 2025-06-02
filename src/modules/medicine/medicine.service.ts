import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { TblMedicine } from "src/entities/TblMedicine.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MedicineService extends BaseService<TblMedicine> {
  constructor(
    @InjectRepository(TblMedicine) public medicineRepo: Repository<TblMedicine>,
  ) {
    super(medicineRepo);
  }
}
