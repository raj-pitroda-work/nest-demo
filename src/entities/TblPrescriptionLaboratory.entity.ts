import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblExemption } from "./TblExemption.entity";
import { TblLaboratory } from "./TblLaboratory.entity";
import { TblPediatricianSubPrescription } from "./TblPediatricianSubPrescription.entity";
import { TblPrescriptionServicePriority } from "./TblPrescriptionServicePriority.entity";
import { TblPrescriptionServiceTipAccess } from "./TblPrescriptionServiceTipAccess.entity";
import { TblBranch } from "./TblBranch.entity";

@Index("tblPrescriptionLaboratory_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionLaboratory", { schema: "public" })
export class TblPrescriptionLaboratory {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("smallint", { name: "quantity" })
  quantity!: number;

  @Column("smallint", { name: "noOfSessions" })
  noOfSessions!: number;

  @Column("character varying", { name: "explanatoryNote", length: 100 })
  explanatoryNote!: string;

  @Column("boolean", { name: "isSuggestedPrescription", nullable: true })
  isSuggestedPrescription?: boolean | null;

  @Column("smallint", { name: "exemptionId" })
  exemptionId!: number;
  @ManyToOne(
    () => TblExemption,
    (tblExemption) => tblExemption.prescriptionLaboratories,
  )
  @JoinColumn([{ name: "exemptionId", referencedColumnName: "id" }])
  exemption!: TblExemption;

  @Column("integer", { name: "laboratoryId" })
  laboratoryId!: number;
  @ManyToOne(
    () => TblLaboratory,
    (tblLaboratory) => tblLaboratory.prescriptionLaboratories,
  )
  @JoinColumn([{ name: "laboratoryId", referencedColumnName: "id" }])
  laboratory!: TblLaboratory;

  @Column("integer", { name: "subPrescriptionId" })
  subPrescriptionId!: number;
  @ManyToOne(
    () => TblPediatricianSubPrescription,
    (tblPediatricianSubPrescription) =>
      tblPediatricianSubPrescription.prescriptionLaboratories,
  )
  @JoinColumn([{ name: "subPrescriptionId", referencedColumnName: "id" }])
  subPrescription!: TblPediatricianSubPrescription;

  @Column("smallint", { name: "servicePriorityId" })
  servicePriorityId!: number;
  @ManyToOne(
    () => TblPrescriptionServicePriority,
    (tblPrescriptionServicePriority) =>
      tblPrescriptionServicePriority.prescriptionLaboratories,
  )
  @JoinColumn([{ name: "servicePriorityId", referencedColumnName: "id" }])
  servicePriority!: TblPrescriptionServicePriority;

  @Column("smallint", { name: "tipAccessId" })
  tipAccessId!: number;
  @ManyToOne(
    () => TblPrescriptionServiceTipAccess,
    (tblPrescriptionServiceTipAccess) =>
      tblPrescriptionServiceTipAccess.prescriptionLaboratories,
  )
  @JoinColumn([{ name: "tipAccessId", referencedColumnName: "id" }])
  tipAccess!: TblPrescriptionServiceTipAccess;

  @Column("integer", { name: "branchId" })
  branchId!: number;
  @ManyToOne(() => TblBranch, (tblBranch) => tblBranch.prescriptionLaboratories)
  @JoinColumn([{ name: "branchId", referencedColumnName: "id" }])
  branch!: TblBranch;

  constructor(init?: Partial<TblPrescriptionLaboratory>) {
    Object.assign(this, init);
  }
}
