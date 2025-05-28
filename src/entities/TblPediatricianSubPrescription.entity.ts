import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblUser } from "./TblUser.entity";
import { TblPrescription } from "./TblPrescription.entity";
import { TblPrescriptionLaboratory } from "./TblPrescriptionLaboratory.entity";
import { TblPrescriptionMedicine } from "./TblPrescriptionMedicine.entity";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";

@Index("tblPediatricianSubPrescription_pkey", ["id"], { unique: true })
@Entity("tblPediatricianSubPrescription", { schema: "public" })
export class TblPediatricianSubPrescription {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("boolean", { name: "isForMedicine", nullable: true })
  isForMedicine?: boolean | null;

  @Column("boolean", { name: "isForLab", nullable: true })
  isForLab?: boolean | null;

  @Column("boolean", { name: "isForService", nullable: true })
  isForService?: boolean | null;

  @Column("integer", { name: "pediatricianId" })
  pediatricianId!: number;
  @ManyToOne(() => TblUser, (tblUser) => tblUser.pediatricianSubPrescriptions)
  @JoinColumn([{ name: "pediatricianId", referencedColumnName: "id" }])
  pediatrician!: TblUser;

  @Column("integer", { name: "prescriptionId" })
  prescriptionId!: number;
  @ManyToOne(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.pediatricianSubPrescriptions,
  )
  @JoinColumn([{ name: "prescriptionId", referencedColumnName: "id" }])
  prescription!: TblPrescription;

  @OneToMany(
    () => TblPrescriptionLaboratory,
    (tblPrescriptionLaboratory) => tblPrescriptionLaboratory.subPrescription,
  )
  prescriptionLaboratories!: TblPrescriptionLaboratory[];

  @OneToMany(
    () => TblPrescriptionMedicine,
    (tblPrescriptionMedicine) => tblPrescriptionMedicine.subPrescription,
  )
  prescriptionMedicines!: TblPrescriptionMedicine[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.subPrescription,
  )
  prescriptionServices!: TblPrescriptionService[];

  constructor(init?: Partial<TblPediatricianSubPrescription>) {
    Object.assign(this, init);
  }
}
