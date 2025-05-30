import { InjectRepository } from "@nestjs/typeorm";
import { ObjectLiteral, Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";
import { USER_ROLE_IDS } from "src/utils/constant";
import { TblCity } from "src/entities/TblCity.entity";
import { TblMedicineDosage } from "src/entities/TblMedicineDosage.entity";
import { Injectable } from "@nestjs/common";
import { TblPrescriptionPediatricianRejectStatus } from "src/entities/TblPrescriptionPediatricianRejectStatus.entity";
import { TblChildren } from "src/entities/TblChildren.entity";

@Injectable()
export class LookupService {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
    @InjectRepository(TblCity) private cityRepo: Repository<TblCity>,
    @InjectRepository(TblChildren) private childRepo: Repository<TblChildren>,
    @InjectRepository(TblMedicineDosage)
    private medicineDosageRepo: Repository<TblMedicineDosage>,
    @InjectRepository(TblPrescriptionPediatricianRejectStatus)
    private rejectReasonRepo: Repository<TblPrescriptionPediatricianRejectStatus>,
  ) {}
  getRoles = async () => {
    return await this.roleService.repo
      .createQueryBuilder("role")
      .select(["role.name as label", "role.id as value"])
      .getRawMany();
  };

  getPediatricians = async () => {
    return await this.userService.userRepo
      .createQueryBuilder("user")
      .select([
        "user.id AS value",
        "CONCAT(user.firstName, ' ', user.lastName) AS label",
      ])
      .where("user.roleId = :roleId", { roleId: USER_ROLE_IDS.pediatrician })
      .getRawMany();
  };

  getCities = async () => {
    return await this.cityRepo
      .createQueryBuilder("role")
      .select(["role.name as label", "role.id as value"])
      .getRawMany();
  };

  getRejectReasons = async () => {
    return await this.rejectReasonRepo
      .createQueryBuilder("entity")
      .select(["entity.reason as label", "entity.reason as value"])
      .getRawMany();
  };

  getPosologies = async () => {
    const rawResult = await this.medicineDosageRepo
      .createQueryBuilder("entity")
      .select([
        "entity.label as label",
        "entity.id as value",
        `entity.medicineTypeId as "medicineTypeId"`,
      ])
      .getRawMany();

    const result = rawResult.reduce(
      (acc, item) => {
        const { medicineTypeId, label, value } = item;
        if (!acc[medicineTypeId]) {
          acc[medicineTypeId] = [];
        }
        acc[medicineTypeId].push({ label, value });
        return acc;
      },
      {} as Record<number, { label: string; value: number }[]>,
    );
    return result;
  };

  getPediatriciansLookupsByParentId = async (parentId: number) => {
    const raw = await this.childRepo
      .createQueryBuilder("child")
      .leftJoin("tblChildrenPediatrician", "cp", "cp.childId = child.id")
      .leftJoin(
        "tblUser",
        "pediatrician",
        "pediatrician.id = cp.pediatricianId",
      )
      .leftJoin(
        "tblPrescription",
        "prescription",
        "prescription.patientId = child.id AND prescription.pediatricianId = pediatrician.id",
      )
      .where("child.parentId = :parentId", { parentId })
      .andWhere("pediatrician.roleId = :pediatricianRoleId", {
        pediatricianRoleId: USER_ROLE_IDS.pediatrician,
      })
      .select([
        `child.id AS "childId"`,
        `pediatrician.id AS "pediatricianId"`,
        `pediatrician.firstName || ' ' || pediatrician.lastName AS "pediatricianName"`,
        `COUNT(DISTINCT prescription.id || '-' || pediatrician.id) AS "prescriptionCount"`,
      ])
      .groupBy("child.id")
      .addGroupBy("pediatrician.id")
      .addGroupBy("pediatrician.firstName")
      .addGroupBy("pediatrician.lastName")
      .getRawMany();
    const result: {
      [key: number]: {
        lookups: { value: number; label: string }[];
        prescriptionCount: ObjectLiteral;
      };
    } = {};

    raw.forEach(
      ({ childId, pediatricianId, pediatricianName, prescriptionCount }) => {
        if (!result[childId]) {
          result[childId] = { lookups: [], prescriptionCount: {} };
        }
        result[childId].lookups.push({
          value: pediatricianId,
          label: pediatricianName,
        });

        result[childId].prescriptionCount[pediatricianId] =
          (result[childId].prescriptionCount[pediatricianId] || 0) +
          (Number(prescriptionCount) || 0);
      },
    );

    return result;
  };
}
