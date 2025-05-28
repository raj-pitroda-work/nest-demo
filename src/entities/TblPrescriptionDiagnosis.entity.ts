import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescription } from "./TblPrescription.entity";

@Index("tblPrescriptionDiagnosis_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionDiagnosis", { schema: "public" })
export class TblPrescriptionDiagnosis {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @Column("character varying", { name: "code", length: 20 })
  code!: string;

  @OneToMany(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.diagnosis,
  )
  prescriptions!: TblPrescription[];
}
