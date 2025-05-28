import { Column, Entity, Index, OneToMany } from "typeorm";
import { TblPatientExemption } from "./TblPatientExemption.entity";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";

@Index("tblExemption_pkey", ["id"], { unique: true })
@Entity("tblExemption", { schema: "public" })
export class TblExemption {
  @Column("smallint", { primary: true, name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 100 })
  name!: string;

  @Column("character varying", { name: "description", length: 255 })
  description!: string;

  @Column("character varying", { name: "type", length: 100 })
  type!: string;

  @Column("character varying", { name: "code", length: 20 })
  code!: string;

  @OneToMany(
    () => TblPatientExemption,
    (tblPatientExemption) => tblPatientExemption.exemption,
  )
  patientExemptions!: TblPatientExemption[];

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.exemption,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.exemption,
  )
  tblPrescriptionMedicines!: TblPrescriptionMedicine[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.exemption,
  )
  prescriptionServices!: TblPrescriptionService[];
}
