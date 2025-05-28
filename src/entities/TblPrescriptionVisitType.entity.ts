import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescription } from "./TblPrescription.entity";

@Index("tblPrescriptionVisitType_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionVisitType", { schema: "public" })
export class TblPrescriptionVisitType {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "visityType" })
  visitType!: string;

  @OneToMany(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.prescriptionVisitType,
  )
  prescriptions!: TblPrescription[];
}
