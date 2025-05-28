import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescription } from "./TblPrescription.entity";

@Index("tblPrescriptionPatientFile_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionPatientFile", { schema: "public" })
export class TblPrescriptionPatientFile {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @Column("text", { name: "base64" })
  base64!: string;

  @Column({ type: "integer", name: "prescriptionId" })
  prescriptionId!: number;

  @ManyToOne(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.prescriptionPatientFiles,
  )
  @JoinColumn([{ name: "prescriptionId", referencedColumnName: "id" }])
  prescription!: TblPrescription;
}
