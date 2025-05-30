import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicine } from "./TblMedicine.entity";
import { TblMedicineDosage } from "./TblMedicineDosage.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";

@Index("tblMedicineType_pkey", ["id"], { unique: true })
@Entity("tblMedicineType", { schema: "public" })
export class TblMedicineType {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 10 })
  name: string;

  @OneToMany(() => TblMedicine, (tblMedicine) => tblMedicine.medicineType)
  tblMedicines: TblMedicine[];

  @OneToMany(
    () => TblMedicineDosage,
    (tblMedicineDosage) => tblMedicineDosage.medicineType,
  )
  tblMedicineDosages: TblMedicineDosage[];

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.medicineType,
  )
  tblPrescriptionMedicines: TblPrescriptionMedicine[];
}
