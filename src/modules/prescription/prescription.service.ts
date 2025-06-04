import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblPrescription } from "src/entities/TblPrescription.entity";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";

@Injectable()
export class PrescriptionService extends BaseService<TblPrescription> {
  constructor(
    @InjectRepository(TblPrescription)
    public prescriptionRepo: Repository<TblPrescription>,
  ) {
    super(prescriptionRepo);
  }

  getPrescriptionById = async (prescriptionId: number) => {
    const result = await this.prescriptionRepo
      .createQueryBuilder("pres")
      .leftJoin("tblChildren", "pt", "pt.id = pres.patientId")
      .leftJoin("tblUser", "user", "pt.parentId = user.id")
      .leftJoin("tblPrescriptionStatus", "status", "pres.status = status.id")
      .leftJoin(
        "tblPrescriptionPatientFile",
        "file",
        "file.prescriptionId = pres.id",
      )
      .leftJoin(
        "tblPatientExemption",
        "pex",
        "pex.patientId = pt.id AND  CURRENT_DATE < pex.endDate",
      )
      .leftJoin("tblExemption", "ex", "ex.id = pex.exemptionId")
      .where("pres.id = :id", { id: prescriptionId })
      .select([
        "pres.id as id",
        "pt.dob as dob",
        `pres.requestDescription as "requestDescription"`,
        `pres.motivationNotes as "motivationNotes"`,
        `pres.updatedAt as "updatedAt"`,
        `pres.statusId as "statusId"`,
        `status.name as "status"`,
        `pt.id as "patientId"`,
        `pt.img as "patientBase64"`,
        `CONCAT(pt.firstName, ' ', pt.lastName) as "patientFullName"`,
        `CONCAT(user.firstName, ' ', user.lastName) as "parentFullName"`,
        `user.id as "parentId"`,

        `file.id as "fileId"`,
        `file.name as "fileName"`,
        `file.base64 as "base64"`,

        `STRING_AGG(DISTINCT ex.name, ', ') as "exemptions"`,
      ])
      .groupBy(
        [
          "pres.id",
          "pres.requestDescription",
          "pres.motivationNotes",
          "pres.updatedAt",
          "pres.statusId",
          "status.name",
          "pt.id",
          "pt.firstName",
          "pt.lastName",
          "user.id",
          "user.firstName",
          "user.lastName",
          "file.id",
          "file.name",
          "file.base64",
        ].join(", "),
      )
      .getRawMany();

    const prescription = result.reduce((acc, row) => {
      if (!acc.id) {
        acc = {
          ...row,
          fileId: undefined,
          fileName: undefined,
          base64: undefined,
          files: [],
        };
      }

      if (row.fileId) {
        acc.files.push({
          id: row.fileId,
          fileName: row.fileName,
          base64: row.base64,
        });
      }

      return acc;
    }, {} as any);
    return prescription;
  };
}
