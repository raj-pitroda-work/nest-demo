import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescription } from "./TblPrescription.entity";

@Index("tblPrescribedPrescriptionFile_pkey", ["id"], { unique: true })
@Entity("tblPrescribedPrescriptionFile", { schema: "public" })
export class TblPrescribedPrescriptionFile {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @Column("text", { name: "base64" })
  base64!: string;

  @Column("character varying", { name: "uniqueString", length: 20 })
  uniqueString!: string;

  @Column("text", { name: "barcodeBase64" })
  barcodeBase64!: string;

  @OneToOne(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.prescribedPrescriptionFile,
  )
  prescription!: TblPrescription;

  constructor(init?: Partial<TblPrescribedPrescriptionFile>) {
    Object.assign(this, init);
  }
}
