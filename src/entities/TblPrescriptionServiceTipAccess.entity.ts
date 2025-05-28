import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";

@Index("tblPrescriptionServiceTipAccess_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionServiceTipAccess", { schema: "public" })
export class TblPrescriptionServiceTipAccess {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.tipAccess,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.tipAccess,
  )
  tblPrescriptionServices!: TblPrescriptionService[];
}
