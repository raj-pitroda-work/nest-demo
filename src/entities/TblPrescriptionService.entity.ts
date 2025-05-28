import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblExemption } from "./TblExemption.entity";
import { TblPediatricianSubPrescription } from "./TblPediatricianSubPrescription.entity";
import { TblPrescriptionServicePriority } from "./TblPrescriptionServicePriority.entity";
import { TblPrescriptionServiceTipAccess } from "./TblPrescriptionServiceTipAccess.entity";
import { TblService } from "./TblService.entity";
import { TblBranch } from "./TblBranch.entity";

@Index("tblPrescriptionService_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionService", { schema: "public" })
export class TblPrescriptionService {
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
    (tblExemption) => tblExemption.prescriptionServices,
  )
  @JoinColumn([{ name: "exemptionId", referencedColumnName: "id" }])
  exemption!: TblExemption;

  @Column("integer", { name: "subPrescriptionId" })
  subPrescriptionId!: number;
  @ManyToOne(
    () => TblPediatricianSubPrescription,
    (tblPediatricianSubPrescription) =>
      tblPediatricianSubPrescription.prescriptionServices,
  )
  @JoinColumn([{ name: "subPrescriptionId", referencedColumnName: "id" }])
  subPrescription!: TblPediatricianSubPrescription;

  @Column("integer", { name: "serviceId" })
  serviceId!: number;
  @ManyToOne(() => TblService, (tblService) => tblService.prescriptionServices)
  @JoinColumn([{ name: "serviceId", referencedColumnName: "id" }])
  service!: TblService;

  @Column("smallint", { name: "servicePriorityId" })
  servicePriorityId!: number;
  @ManyToOne(
    () => TblPrescriptionServicePriority,
    (tblPrescriptionServicePriority) =>
      tblPrescriptionServicePriority.tblPrescriptionServices,
  )
  @JoinColumn([{ name: "servicePriorityId", referencedColumnName: "id" }])
  servicePriority!: TblPrescriptionServicePriority;

  @Column("smallint", { name: "tipAccessId" })
  tipAccessId!: number;
  @ManyToOne(
    () => TblPrescriptionServiceTipAccess,
    (tblPrescriptionServiceTipAccess) =>
      tblPrescriptionServiceTipAccess.tblPrescriptionServices,
  )
  @JoinColumn([{ name: "tipAccessId", referencedColumnName: "id" }])
  tipAccess!: TblPrescriptionServiceTipAccess;

  @Column("integer", { name: "branchId" })
  branchId!: number;
  @ManyToOne(() => TblBranch, (tblBranch) => tblBranch.prescriptionServices)
  @JoinColumn([{ name: "branchId", referencedColumnName: "id" }])
  branch!: TblBranch;

  constructor(init?: Partial<TblPrescriptionService>) {
    Object.assign(this, init);
  }
}
