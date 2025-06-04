import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { TblPatientExemption } from "src/entities/TblPatientExemption.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PtExemptionService extends BaseService<TblPatientExemption> {
  constructor(
    @InjectRepository(TblPatientExemption)
    public ptExemptionRepo: Repository<TblPatientExemption>,
  ) {
    super(ptExemptionRepo);
  }

  getPtExemptionLookups = async (ptId: number) => {
    const exemptions = await this.ptExemptionRepo
      .createQueryBuilder("ptExemption")
      .leftJoin("ptExemption.exemption", "exemption")
      .where("ptExemption.patientId = :ptId", { ptId })
      .orderBy("ptExemption.id", "DESC")
      .select([
        "ptExemption.id as value",
        `exemption.id as "exemptionId"`,
        `CONCAT(exemption.name, ' - ', exemption.code) as label`,
      ])
      .getRawMany();
    console.log("exemptions", exemptions);

    return exemptions;
  };
}
