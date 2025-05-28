import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicineCategory } from "./TblMedicineCategory.entity";
import { TblMedicineType } from "./TblMedicineType.entity";
import { TblMedicineCompany } from "./TblMedicineCompany.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";

@Index("tblMedicine_pkey", ["id"], { unique: true })
@Entity("tblMedicine", { schema: "public" })
export class TblMedicine {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @Column("character varying", { name: "note", length: 250 })
  note!: string;

  @Column("numeric", { name: "priceInEuro", precision: 10, scale: 2 })
  priceInEuro!: string;

  @Column("character varying", { name: "packageSize", length: 100 })
  packageSize!: string;

  @Column("smallint", { name: "categoryId" })
  categoryId!: number;
  @ManyToOne(
    () => TblMedicineCategory,
    (tblMedicineCategory) => tblMedicineCategory.medicines,
  )
  @JoinColumn([{ name: "categoryId", referencedColumnName: "id" }])
  category!: TblMedicineCategory;

  @Column("smallint", { name: "medicineTypeId" })
  medicineTypeId!: number;
  @ManyToOne(
    () => TblMedicineType,
    (tblMedicineType) => tblMedicineType.medicines,
  )
  @JoinColumn([{ name: "medicineTypeId", referencedColumnName: "id" }])
  medicineType!: TblMedicineType;

  @Column("integer", { name: "companyId" })
  companyId!: number;
  @ManyToOne(
    () => TblMedicineCompany,
    (tblMedicineCompany) => tblMedicineCompany.medicines,
  )
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company!: TblMedicineCompany;

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.medicine,
  )
  prescriptionMedicines!: TblPrescriptionMedicine[];
}
