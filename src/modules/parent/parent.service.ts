import { Injectable } from "@nestjs/common";
import { CreateParentPrescriptionRequestDTO } from "./parent.dto";
import { UploadedFile } from "express-fileupload";
import { TblPrescription } from "src/entities/TblPrescription.entity";
import { DataSource } from "typeorm";
import {
  PRESCRIPTION_STATUS_ENUM,
  PRESCRIPTION_STATUS_ID,
} from "src/utils/constant";
import { TblPrescriptionPatientFile } from "src/entities/TblPrescriptionPatientFile.entity";
import { throwCustomError } from "src/exceptions/customException";
import { IParentPrescriptions } from "./parent.type";
import { PrescriptionService } from "../prescription/prescription.service";

@Injectable()
export class ParentService {
  constructor(
    private dataSource: DataSource,
    private prescriptionService: PrescriptionService,
  ) {}

  getPrescriptions = async (
    parentId: number,
    childId: number,
    pediatricianId: number,
    status: string,
  ): Promise<IParentPrescriptions[]> => {
    const query = this.prescriptionService.prescriptionRepo
      .createQueryBuilder("pres")
      .leftJoin("pres.status", "status")
      .leftJoin(
        (qb) =>
          qb
            .select("sub.prescriptionId", "prescriptionId")
            .addSelect("COUNT(DISTINCT med.id)", "medicineCount")
            .addSelect("COUNT(DISTINCT lab.id)", "laboratoryCount")
            .addSelect("COUNT(DISTINCT ser.id)", "serviceCount")
            .from("tblPediatricianSubPrescription", "sub")
            .leftJoin(
              "tblPrescriptionMedicine",
              "med",
              "med.subPrescriptionId = sub.id",
            )
            .leftJoin(
              "tblPrescriptionLaboratory",
              "lab",
              "lab.subPrescriptionId = sub.id",
            )
            .leftJoin(
              "tblPrescriptionService",
              "ser",
              "ser.subPrescriptionId = sub.id",
            )
            .groupBy("sub.prescriptionId"),
        "counts",
        `"counts"."prescriptionId" = pres.id`,
      )
      .leftJoin(
        (qb) =>
          qb
            .select("pf.prescriptionId", "prescriptionId")
            .addSelect(`STRING_AGG(pf.name, ', ') AS "patientFileNames"`)
            .from("tblPrescriptionPatientFile", "pf")
            .groupBy("pf.prescriptionId"),
        "files",
        `"files"."prescriptionId" = pres.id`,
      )
      .leftJoin(
        "tblPrescribedPrescriptionFile",
        "prescribed",
        `pres.prescribedPrescriptionFileId = prescribed.id`,
      )
      .select([
        `TO_CHAR(DATE_TRUNC('month', pres.updatedAt), 'FMMonth YYYY') AS month`,
        `JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', pres.id,
          'requestDescription', pres.requestDescription,
          'statusId', pres.statusId,
          'status', status.name,
          'rejectReason', pres.rejectReason,
          'medicineCount', COALESCE("counts"."medicineCount", 0),
          'laboratoryCount', COALESCE("counts"."laboratoryCount", 0),
          'serviceCount', COALESCE("counts"."serviceCount", 0),
          'patientFileNames', COALESCE("files"."patientFileNames", ''),
          'updatedAt', pres."updatedAt",
          'motivationNotes', pres."motivationNotes",
          'createdAt', pres."createdAt",
          'prescribedPrescriptionFileName',prescribed.name,
          'prescribedPrescriptionFileId',prescribed.id,
          'prescribedPrescriptionBarcode',prescribed."barcodeBase64"
        )
        ORDER BY pres."id" DESC
      ) AS prescriptions`,
      ])
      .where("pres.parentId = :parentId", { parentId })
      .andWhere("pres.pediatricianId = :pediatricianId", { pediatricianId })
      .andWhere("pres.patientId = :patientId", { patientId: childId })
      .groupBy(`DATE_TRUNC('month', pres.updatedAt)`)
      .orderBy(`DATE_TRUNC('month', pres.updatedAt)`, "DESC");
    if (status)
      query.andWhere(`status.name IN (:...status)`, {
        status: [
          PRESCRIPTION_STATUS_ENUM.PR01,
          PRESCRIPTION_STATUS_ENUM.PR03,
        ].includes(status)
          ? [PRESCRIPTION_STATUS_ENUM.PR01, PRESCRIPTION_STATUS_ENUM.PR03]
          : [status],
      });

    const rawResults: IParentPrescriptions[] = await query.getRawMany();

    return rawResults;
  };

  cancelPrescription = async (id: number): Promise<TblPrescription> => {
    const exRes =
      await this.prescriptionService.prescriptionRepo.findOneByOrFail({
        id,
      });

    exRes.statusId = PRESCRIPTION_STATUS_ID.PR09;
    const result = await this.prescriptionService.update(id, exRes);
    return result;
  };

  createNewPrescriptionRequest = async (
    data: CreateParentPrescriptionRequestDTO,
    medFiles: UploadedFile[],
    parentId: number,
  ): Promise<TblPrescription> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const newPrescription = new TblPrescription({
        ...data,
        statusId: PRESCRIPTION_STATUS_ID.PR01,
        updatedAt: new Date(),
        parentId,
      });
      const prescriptionResult =
        await queryRunner.manager.save(newPrescription);

      const medicalFiles: TblPrescriptionPatientFile[] = [];
      medFiles.forEach((file) => {
        const newMed = new TblPrescriptionPatientFile();
        newMed.name = file.name;
        newMed.prescriptionId = prescriptionResult.id;
        newMed.base64 = file.data.toString("base64");
        medicalFiles.push(newMed);
      });

      await queryRunner.manager.save(medicalFiles);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return newPrescription;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throwCustomError(error);
    }
  };

  updatePrescriptionRequest = async (
    id: number,
    data: CreateParentPrescriptionRequestDTO,
    medFiles: UploadedFile[],
  ): Promise<TblPrescription> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    const exPres = await this.getPrescriptionDetail(id);

    try {
      Object.assign(exPres, {
        motivationNotes: data.motivationNotes,
        requestDescription: data.requestDescription,
        updatedAt: new Date(),
      });
      await queryRunner.manager.save(exPres);

      const exMedFiles: TblPrescriptionPatientFile[] =
        exPres.prescriptionPatientFiles;

      const incomingFileNames = medFiles.map((file) => file.name);

      const newMedFiles = medFiles.filter(
        (file) => !exMedFiles.some((existing) => existing.name === file.name),
      );

      const toDltMedFiles = exMedFiles.reduce(
        (
          ac: TblPrescriptionPatientFile[],
          current: TblPrescriptionPatientFile,
        ) => {
          if (!incomingFileNames.includes(current.name)) {
            ac.push(current);
          }
          return ac;
        },
        [],
      );

      const newMedToInsert: TblPrescriptionPatientFile[] = [];
      newMedFiles.forEach((file) => {
        {
          const newMed = new TblPrescriptionPatientFile();
          newMed.name = file.name;
          newMed.prescriptionId = id;
          newMed.base64 = file.data.toString("base64");
          newMedToInsert.push(newMed);
        }
      });

      await queryRunner.manager.save(newMedToInsert);
      await queryRunner.manager.remove(
        TblPrescriptionPatientFile,
        toDltMedFiles,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return exPres;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throwCustomError(error);
    }
  };

  getPrescriptionDetail = async (id: number) => {
    const result =
      await this.prescriptionService.prescriptionRepo.findOneOrFail({
        where: { id },
        relations: ["prescriptionPatientFiles"],
      });

    return result;
  };
}
