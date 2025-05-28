import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicine } from "./TblMedicine.entity";

@Index("tblMedicineCategory_pkey", ["id"], { unique: true })
@Entity("tblMedicineCategory", { schema: "public" })
export class TblMedicineCategory {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @OneToMany(() => TblMedicine, (tblMedicine) => tblMedicine.category)
  medicines!: TblMedicine[];
}
