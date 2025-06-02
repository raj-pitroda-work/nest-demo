import { Injectable } from "@nestjs/common";
import {
  MAX_LAB_SER_COUNT_ALLOWED,
  MAX_MED_COUNT_ALLOWED,
  PRESCRIPTION_STATUS_ENUM,
  PRESCRIPTION_STATUS_ID,
} from "src/utils/constant";
import { PrescriptionService } from "../prescription/prescription.service";
import { RejectPrescriptionDTO } from "./pediatricianDto/rejectPrescriptionDTO";
import { TblMedicine } from "src/entities/TblMedicine.entity";
import { TblService } from "src/entities/TblService.entity";
import { TblLaboratory } from "src/entities/TblLaboratory.entity";
import {
  CreateElWhitePrescriptionDTO,
  CreateElWhitePrescriptionLabDTO,
  CreateElWhitePrescriptionMedDTO,
  CreateElWhitePrescriptionServiceDTO,
} from "./pediatricianDto/elWhitePrescriptionDTO";
import { ITokenUser } from "src/types/commonType";
import { DataSource } from "typeorm";
import { TblPediatricianSubPrescription } from "src/entities/TblPediatricianSubPrescription.entity";
import { TblPrescriptionMedicine } from "src/entities/TblPrescriptionMedicine.entity";
import { TblPrescriptionLaboratory } from "src/entities/TblPrescriptionLaboratory.entity";
import { TblPrescriptionService } from "src/entities/TblPrescriptionService.entity";
import { TblPrescribedPrescriptionFile } from "src/entities/TblPrescribedPrescriptionFile.entity";
import { TblPrescription } from "src/entities/TblPrescription.entity";
import { throwCustomError } from "src/exceptions/customException";
import { TblChildren } from "src/entities/TblChildren.entity";
import { IPediaElWhitePdfData } from "./pediatricianDto/createPrescriptionDTO";
import { MedicineService } from "../medicine/medicine.service";
import { ServiceService } from "../service/service.service";
import { LaboratoryService } from "../laboratory/laboratory.service";
import * as path from "path";
import {
  generateBarcodeBase64,
  getBase64FromEjsContent,
} from "src/utils/helperFun";
import { ChildrenService } from "../children/children.service";

@Injectable()
export class PediatricianService {
  constructor(
    private prescriptionService: PrescriptionService,
    private medicineService: MedicineService,
    private serviceService: ServiceService,
    private labService: LaboratoryService,
    private childService: ChildrenService,
    private dataSource: DataSource,
  ) {}
  markPrescriptionInProgress = async (prescriptionId: number) => {
    const exPrescription =
      await this.prescriptionService.prescriptionRepo.findOneOrFail({
        where: { id: prescriptionId },
      });
    if (exPrescription)
      return await this.prescriptionService.update(prescriptionId, {
        statusId: PRESCRIPTION_STATUS_ID.PR03,
      });
  };

  pediatricianPrescriptionCount = async (
    pediatricianId: number,
  ): Promise<number> => {
    const count = await this.prescriptionService.prescriptionRepo.countBy({
      pediatricianId,
    });

    return count;
  };

  rejectPrescriptionByPediatrician = async (
    rejectData: RejectPrescriptionDTO,
  ) => {
    const { prescriptionId: id, reason } = rejectData;
    const result =
      await this.prescriptionService.prescriptionRepo.findOneByOrFail({
        id,
      });
    Object.assign(result, {
      rejectReason: reason,
      statusId: PRESCRIPTION_STATUS_ID.PR02,
      updatedAt: new Date(),
    });
    await this.prescriptionService.update(id, result);
    return result;
  };

  getPrescriptionByPediatricianId = async (
    pediatricianId: number,
    status: string,
  ) => {
    const query = this.prescriptionService.prescriptionRepo
      .createQueryBuilder("pres")
      .where(`pres.pediatricianId = :id`, { id: pediatricianId })
      .leftJoin("tblChildren", "pt", "pt.id = pres.patientId")
      .leftJoin("tblUser", "user", "pt.parentId = user.id")
      .leftJoin("tblPrescriptionStatus", "status", "pres.status = status.id")
      .select([
        "pres.id as id",
        `pres.updatedAt as "updatedAt"`,
        `pres.updatedAt as "updatedAt"`,
        `pres.statusId as "statusId"`,
        `status.name as "status"`,
        `pt.id as "patientId"`,
        `CONCAT(pt.firstName, ' ', pt.lastName) as "patientFullName"`,
        `CONCAT(user.firstName, ' ', user.lastName) as "parentFullName"`,
        `user.id as "parentId"`,
      ])
      .orderBy("pres.id", "DESC");

    if (status)
      query.andWhere(`status.name IN (:...status)`, {
        status: [
          PRESCRIPTION_STATUS_ENUM.PR01,
          PRESCRIPTION_STATUS_ENUM.PR03,
        ].includes(status)
          ? [PRESCRIPTION_STATUS_ENUM.PR01, PRESCRIPTION_STATUS_ENUM.PR03]
          : [status],
      });

    return query.getRawMany();
  };

  getPrescriptionById = async (id: number) => {
    return await this.prescriptionService.getPrescriptionById(id);
  };

  getMedicines = async (search: string = ""): Promise<TblMedicine[]> => {
    const result = await this.medicineService.medicineRepo
      .createQueryBuilder("medicine")
      .leftJoinAndSelect("medicine.category", "category")
      .leftJoinAndSelect("medicine.medicineType", "medicineType")
      .leftJoinAndSelect("medicine.company", "company")
      .where(
        `
          LOWER(medicine.name) LIKE LOWER(:search)
          OR LOWER(medicine.note) LIKE LOWER(:search)
          OR LOWER(medicine.packageSize) LIKE LOWER(:search)
          OR LOWER(category.name) LIKE LOWER(:search)
          OR LOWER(company.name) LIKE LOWER(:search)
          OR CAST(medicine.priceInEuro AS TEXT) LIKE :search
      `,
        {
          search: `%${search}%`,
        },
      )
      .getMany();

    return result;
  };

  getServices = async (search: string = ""): Promise<TblService[]> => {
    const result = await this.serviceService.serviceRepo
      .createQueryBuilder("service")
      .leftJoinAndSelect("service.serviceBranches", "serviceBranch")
      .leftJoinAndSelect("serviceBranch.branch", "branch")
      .where(
        `
          LOWER(service.name) LIKE LOWER(:search)
          OR LOWER(service.nomen) LIKE LOWER(:search)
          OR CAST(service.priceInEuro AS TEXT) LIKE :search
          OR CAST(service.cRegNo AS TEXT) LIKE :search
          OR LOWER(branch.name) LIKE LOWER(:search)
       `,
        {
          search: `%${search}%`,
        },
      )
      .getMany();

    return result;
  };

  getLabs = async (search: string = ""): Promise<TblLaboratory[]> => {
    const result = await this.labService.labRepo
      .createQueryBuilder("laboratory")
      .leftJoinAndSelect("laboratory.laboratoryBranches", "laboratoryBranch")
      .leftJoinAndSelect("laboratoryBranch.branch", "branch")
      .where(
        `
        LOWER(laboratory.name) LIKE LOWER(:search)
        OR LOWER(laboratory.nomen) LIKE LOWER(:search)
        OR CAST(laboratory.priceInEuro AS TEXT) LIKE :search
        OR CAST(laboratory.cRegNo AS TEXT) LIKE :search
        OR LOWER(branch.name) LIKE LOWER(:search)
     `,
        {
          search: `%${search}%`,
        },
      )
      .getMany();

    return result;
  };

  createElWhitePrescription = async (
    data: CreateElWhitePrescriptionDTO,
    drData: ITokenUser,
  ) => {
    const { laboratory, medicine, service, prescriptionId } = data;
    const exPrescription =
      await this.prescriptionService.prescriptionRepo.findOneOrFail({
        where: { id: prescriptionId },
      });

    const ptDetail = await this.childService.childRepo.findOneOrFail({
      where: { id: exPrescription.patientId },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Save Medicine
      if (medicine?.length) {
        const medAsPerType = this.getMedAsPerType(medicine);
        for (const x of Object.keys(medAsPerType)) {
          const medArr = medAsPerType[Number(x)];
          for (let i = 0; i < medArr.length; i += MAX_MED_COUNT_ALLOWED) {
            let chunkMedArr = medArr.slice(i, i + MAX_MED_COUNT_ALLOWED);
            const newSubPrescription = new TblPediatricianSubPrescription({
              isForMedicine: true,
              prescriptionId: prescriptionId,
              pediatricianId: exPrescription.pediatricianId,
            });
            const newPresResult =
              await queryRunner.manager.save(newSubPrescription);
            chunkMedArr = chunkMedArr.map(
              (x) =>
                new TblPrescriptionMedicine({
                  ...x,
                  subPrescriptionId: newPresResult.id,
                }),
            );

            await queryRunner.manager.save(chunkMedArr);
          }
        }

        // save service and lab
        const serNLabArr: {
          type: "lab" | "service";
          data:
            | CreateElWhitePrescriptionServiceDTO
            | CreateElWhitePrescriptionLabDTO;
        }[] = [];

        if (laboratory?.length)
          serNLabArr.push(
            ...laboratory.map((lab) => ({ type: "lab" as any, data: lab })),
          );
        if (service?.length)
          serNLabArr.push(
            ...service.map((srv) => ({ type: "service" as any, data: srv })),
          );

        for (let i = 0; i < serNLabArr.length; i += MAX_LAB_SER_COUNT_ALLOWED) {
          const chunkSerLabArr = serNLabArr.slice(
            i,
            i + MAX_LAB_SER_COUNT_ALLOWED,
          );

          const newSubPrescription = new TblPediatricianSubPrescription({
            isForLab: chunkSerLabArr.find((x) => x.type === "lab")
              ? true
              : false,
            isForService: chunkSerLabArr.find((x) => x.type === "service")
              ? true
              : false,
            prescriptionId,
            pediatricianId: exPrescription.pediatricianId,
          });

          const newPresResult =
            await queryRunner.manager.save(newSubPrescription);

          for (const item of chunkSerLabArr) {
            if (item.type === "lab") {
              const labEntity = new TblPrescriptionLaboratory({
                ...item.data,
                laboratoryId: item.data.id,
                subPrescriptionId: newPresResult.id,
              });
              await queryRunner.manager.save(labEntity);
            } else {
              const serviceEntity = new TblPrescriptionService({
                ...item.data,
                serviceId: item.data.id,
                subPrescriptionId: newPresResult.id,
              });
              await queryRunner.manager.save(serviceEntity);
            }
          }
        }
      }

      // create pdf
      const { barcodeBase64, prescribePrescriptionPdfBase64, uniqueName } =
        await this.getPrescribedPrescriptionBase64(
          exPrescription,
          data,
          ptDetail,
          drData,
        );

      const newPrescribedPrescriptionDetail = new TblPrescribedPrescriptionFile(
        {
          name: uniqueName,
          base64: prescribePrescriptionPdfBase64,
          barcodeBase64,
          uniqueString: uniqueName,
        },
      );
      const prescribedPresResult = await queryRunner.manager.save(
        newPrescribedPrescriptionDetail,
      );
      await queryRunner.manager.save(
        new TblPrescription({
          ...exPrescription,
          statusId: PRESCRIPTION_STATUS_ID.PR04,
          updatedAt: new Date(),
          prescribedPrescriptionFileId: prescribedPresResult.id,
        }),
      );

      // await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        prescription: exPrescription,
        generatedPrescriptionBase64: prescribePrescriptionPdfBase64,
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throwCustomError(error);
    }
  };

  private getPrescribedPrescriptionBase64 = async (
    exPrescription: TblPrescription,
    data: CreateElWhitePrescriptionDTO,
    ptDetail: TblChildren,
    drData: ITokenUser,
  ) => {
    const { note, medicine, laboratory, service } = data;
    const pdfData: IPediaElWhitePdfData = {
      doctor: {
        name: drData.firstName + " " + drData.lastName,
        email: drData.email,
        piva: "0000000000",
        address: "Via Rossi 32, Potenza, PZ 85100 IT",
        phone: "340 00 00 000",
      },
      patient: {
        cf: ptDetail.taxCode,
        name: ptDetail.firstName + " " + ptDetail.lastName,
      },
      prescription: {
        repeatable: false,
        notes: note,
      },
    };
    if (medicine?.length) {
      pdfData.prescription.medicines = medicine.map((x) => ({
        name: x.name,
        quantity: x.quantity,
        packageSize: x.packageSize,
        posologia: x.posologyLabel,
      }));
    }

    if (laboratory?.length) {
      pdfData.prescription.labTests = laboratory.map((x) => ({
        name: x.name,
        branch: x.branchName,
      }));
    }

    if (service?.length) {
      pdfData.prescription.services = service.map((x) => ({
        name: x.name,
        branch: x.branchName,
      }));
    }

    const prescribePrescriptionPdfBase64 = await getBase64FromEjsContent(
      path.join(__dirname, "..", "..", "templates", "pediaPrescribedPdf.ejs"),
      pdfData,
    );

    const uniqueName = `${ptDetail.firstName}-${ptDetail.lastName}-${exPrescription.id}`;
    console.log(uniqueName, "uniqueNameuniqueNameuniqueName");

    const barcodeBase64 = await generateBarcodeBase64(
      JSON.stringify({
        prescriptionId: exPrescription.id,
        patientId: exPrescription.patientId,
        pediatricianId: exPrescription.pediatricianId,
      }),
      uniqueName,
    );

    return { prescribePrescriptionPdfBase64, barcodeBase64, uniqueName };
  };

  getMedAsPerType = (
    medicines: CreateElWhitePrescriptionMedDTO[],
  ): { [key: number]: TblPrescriptionMedicine[] } => {
    const medAsPerTypeWise: {
      [key: number]: TblPrescriptionMedicine[];
    } = {};
    medicines.forEach((med) => {
      if (!medAsPerTypeWise[med.medicineTypeId]) {
        medAsPerTypeWise[med.medicineTypeId] = [];
      }
      const newMedicine = new TblPrescriptionMedicine({
        ...med,
        quantity: med.quantity,
        medicineDosageId: med.posologyId,
        medicineId: med.id,
        medicineTypeId: med.medicineTypeId,
      });
      medAsPerTypeWise[med.medicineTypeId].push(newMedicine);
    });
    return medAsPerTypeWise;
  };
}
