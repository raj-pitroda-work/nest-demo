import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";

@Index("tblPrescriptionServicePriority_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionServicePriority", { schema: "public" })
export class TblPrescriptionServicePriority {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.servicePriority,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.servicePriority,
  )
  tblPrescriptionServices!: TblPrescriptionService[];
}
