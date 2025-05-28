import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblLaboratoryBranch } from "./TblLaboratoryBranch.entity";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";

@Index("tblLaboratory_pkey", ["id"], { unique: true })
@Entity("tblLaboratory", { schema: "public" })
export class TblLaboratory {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 200 })
  name!: string;

  @Column("character varying", { name: "nomen", length: 100 })
  nomen!: string;

  @Column("numeric", { name: "priceInEuro", precision: 10, scale: 2 })
  priceInEuro!: string;

  @Column("integer", { name: "cRegNo" })
  cRegNo!: number;

  @OneToMany(
    () => TblLaboratoryBranch,
    (tblLaboratoryBranch) => tblLaboratoryBranch.laboratory,
  )
  laboratoryBranches!: TblLaboratoryBranch[];

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.laboratory,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];
}
