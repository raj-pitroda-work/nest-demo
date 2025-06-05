import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblChildren } from "./TblChildren.entity";
import { TblExemption } from "./TblExemption.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";
@Index("tblPatientExemption_pkey", ["id"], { unique: true })
@Entity("tblPatientExemption", { schema: "public" })
export class TblPatientExemption {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("smallint", { name: "exemptionId" })
  exemptionId!: number;

  @Column("timestamp with time zone", { name: "startDate" })
  startDate!: Date;

  @Column("timestamp with time zone", { name: "endDate" })
  endDate!: Date;

  @Column("character varying", { name: "note", length: 255 })
  note!: string;

  @ManyToOne(
    () => TblExemption,
    (tblExemption) => tblExemption.patientExemptions,
  )
  @JoinColumn([{ name: "exemptionId", referencedColumnName: "id" }])
  exemption!: TblExemption;

  @Column("integer", { name: "patientId" })
  patientId!: number;

  @ManyToOne(() => TblChildren, (tblChildren) => tblChildren.patientExemptions)
  @JoinColumn([{ name: "patientId", referencedColumnName: "id" }])
  patient!: TblChildren;

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.patientExemption,
  )
  prescriptionServices!: TblPrescriptionService[];

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.patientExemption,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.patientExemption,
  )
  tblPrescriptionMedicines!: TblPrescriptionMedicine[];
}
