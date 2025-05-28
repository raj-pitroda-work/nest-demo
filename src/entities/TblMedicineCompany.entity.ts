import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblMedicine } from "./TblMedicine.entity";

@Index("tblMedicineCompany_pkey", ["id"], { unique: true })
@Entity("tblMedicineCompany", { schema: "public" })
export class TblMedicineCompany {
  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @OneToMany(() => TblMedicine, (tblMedicine) => tblMedicine.company)
  medicines!: TblMedicine[];
}
