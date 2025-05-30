import { Injectable } from "@nestjs/common";
import { CreateParentPrescriptionRequestDTO } from "./parent.dto";
import { UploadedFile } from "express-fileupload";
import { TblPrescription } from "src/entities/TblPrescription.entity";
import { DataSource } from "typeorm";
import { PRESCRIPTION_STATUS_ID } from "src/utils/constant";
import { TblPrescriptionPatientFile } from "src/entities/TblPrescriptionPatientFile.entity";
import { throwCustomError } from "src/exceptions/customException";

@Injectable()
export class ParentService {
  constructor(private dataSource: DataSource) {}

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
}
