import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicine } from "./TblMedicine.entity";
import { TblMedicineDosage } from "./TblMedicineDosage.entity";
import { TblPediatricianSubPrescription } from "./TblPediatricianSubPrescription.entity";
import { TblMedicineType } from "./TblMedicineType.entity";
import { TblPatientExemption } from "./TblPatientExemption.entity";

@Index("tblPrescriptionMedicine_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionMedicine", { schema: "public" })
export class TblPrescriptionMedicine {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("smallint", { name: "quantity" })
  quantity!: number;

  @Column("boolean", { name: "isNotReplaceable", nullable: true })
  isNotReplaceable?: boolean | null;

  @Column("boolean", { name: "isSuggestedPrescription", nullable: true })
  isSuggestedPrescription?: boolean | null;

  @Column("character varying", {
    name: "irReplaceableReason",
    length: 255,
    nullable: true,
  })
  irReplaceableReason?: string;

  @Column("smallint", { name: "patientExemptionId" })
  patientExemptionId!: number;
  @ManyToOne(
    () => TblPatientExemption,
    (tblPatientExemption) => tblPatientExemption.tblPrescriptionMedicines,
  )
  @JoinColumn([{ name: "patientExemptionId", referencedColumnName: "id" }])
  patientExemption!: TblPatientExemption;

  @Column("smallint", { name: "medicineDosageId" })
  medicineDosageId!: number;
  @ManyToOne(
    () => TblMedicineDosage,
    (tblMedicineDosage) => tblMedicineDosage.prescriptionMedicines,
  )
  @JoinColumn([{ name: "medicineDosageId", referencedColumnName: "id" }])
  medicineDosage!: TblMedicineDosage;

  @Column("integer", { name: "medicineTypeId" })
  medicineTypeId!: number;
  @ManyToOne(
    () => TblMedicineType,
    (tblMedicineType) => tblMedicineType.prescriptionMedicines,
  )
  @JoinColumn([{ name: "medicineTypeId", referencedColumnName: "id" }])
  medicineType!: TblMedicineType;

  @Column("integer", { name: "medicineId" })
  medicineId!: number;
  @ManyToOne(
    () => TblMedicine,
    (tblMedicine) => tblMedicine.prescriptionMedicines,
  )
  @JoinColumn([{ name: "medicineId", referencedColumnName: "id" }])
  medicine!: TblMedicine;

  @Column("integer", { name: "subPrescriptionId" })
  subPrescriptionId!: number;
  @ManyToOne(
    () => TblPediatricianSubPrescription,
    (tblPediatricianSubPrescription) =>
      tblPediatricianSubPrescription.prescriptionMedicines,
  )
  @JoinColumn([{ name: "subPrescriptionId", referencedColumnName: "id" }])
  subPrescription!: TblPediatricianSubPrescription;

  constructor(init?: Partial<TblPrescriptionMedicine>) {
    Object.assign(this, init);
  }
}
