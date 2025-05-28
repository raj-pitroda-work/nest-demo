import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblLaboratoryBranch } from "./TblLaboratoryBranch.entity";
import { TblServiceBranch } from "./TblServiceBranch.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";

@Index("tblBranch_pkey", ["id"], { unique: true })
@Entity("tblBranch", { schema: "public" })
export class TblBranch {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 200 })
  name!: string;

  @OneToMany(
    () => TblServiceBranch,
    (tblServiceBranch) => tblServiceBranch.branch,
  )
  serviceBranches!: TblServiceBranch[];

  @OneToMany(
    () => TblLaboratoryBranch,
    (tblLaboratoryBranch) => tblLaboratoryBranch.branch,
  )
  laboratoryBranches!: TblLaboratoryBranch[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.branch,
  )
  prescriptionServices!: TblPrescriptionService[];

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.branch,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];
}
