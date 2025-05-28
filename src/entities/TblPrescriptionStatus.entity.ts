import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescription } from "./TblPrescription.entity";

@Index("tblPrescriptionStatus_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionStatus", { schema: "public" })
export class TblPrescriptionStatus {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 50 })
  name!: string;

  @OneToMany(() => TblPrescription, (tblPrescription) => tblPrescription.status)
  prescriptions!: TblPrescription[];
}
