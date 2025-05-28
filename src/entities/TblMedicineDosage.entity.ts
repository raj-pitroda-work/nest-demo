import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicineType } from "./TblMedicineType.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";

@Index("tblMedicineDosage_pkey", ["id"], { unique: true })
@Entity("tblMedicineDosage", { schema: "public" })
export class TblMedicineDosage {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "label", length: 100 })
  label!: string;

  @ManyToOne(
    () => TblMedicineType,
    (tblMedicineType) => tblMedicineType.medicineDosages,
  )
  @JoinColumn([{ name: "medicineTypeId", referencedColumnName: "id" }])
  medicineType!: TblMedicineType;

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.medicineDosage,
  )
  prescriptionMedicines!: TblPrescriptionMedicine[];
}
