import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblChildren } from "./TblChildren.entity";
import { TblPediatricianSubPrescription } from "./TblPediatricianSubPrescription.entity";
import { TblPrescriptionDiagnosis } from "./TblPrescriptionDiagnosis.entity";
import { TblPrescriptionPatientFile } from "./TblPrescriptionPatientFile.entity";
import { TblPrescriptionStatus } from "./TblPrescriptionStatus.entity";
import { TblPrescriptionVisitType } from "./TblPrescriptionVisitType.entity";
import { TblUser } from "./TblUser.entity";
import { TblPrescribedPrescriptionFile } from "./TblPrescribedPrescriptionFile.entity";

@Index("tblPrescription_pkey", ["id"], { unique: true })
@Entity("tblPrescription", { schema: "public" })
export class TblPrescription {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "requestDescription", length: 250 })
  requestDescription!: string;

  @Column("character varying", { name: "motivationNotes", length: 250 })
  motivationNotes!: string;

  @Column("timestamp with time zone", { name: "updatedAt" })
  updatedAt!: Date;

  @Column("boolean", {
    name: "isElectronicWhite",
    nullable: true,
    default: () => "false",
  })
  isElectronicWhite?: boolean | null;

  @Column("boolean", {
    name: "isDarkPatientData",
    nullable: true,
    default: () => "false",
  })
  isDarkPatientData?: boolean | null;

  @Column("character varying", {
    name: "rejectReason",
    nullable: true,
    length: 100,
  })
  rejectReason?: string | null;

  @Column({ type: "integer", name: "parentId" })
  parentId!: number;
  @ManyToOne(() => TblUser, (tblUser) => tblUser.parentPrescriptions)
  @JoinColumn([{ name: "parentId", referencedColumnName: "id" }])
  parent!: TblUser;

  @Column({ type: "integer", name: "pediatricianId" })
  pediatricianId!: number;
  @ManyToOne(() => TblUser, (tblUser) => tblUser.prescriptions)
  @JoinColumn([{ name: "pediatricianId", referencedColumnName: "id" }])
  pediatrician!: TblUser;

  @Column({ type: "smallint", name: "diagnosisId" })
  diagnosisId?: number;

  @ManyToOne(
    () => TblPrescriptionDiagnosis,
    (tblPrescriptionDiagnosis) => tblPrescriptionDiagnosis.prescriptions,
  )
  @JoinColumn([{ name: "diagnosisId", referencedColumnName: "id" }])
  diagnosis!: TblPrescriptionDiagnosis;

  @Column({ type: "smallint", name: "patientId" })
  patientId!: number;

  @ManyToOne(() => TblChildren, (tblChildren) => tblChildren.prescriptions)
  @JoinColumn([{ name: "patientId", referencedColumnName: "id" }])
  patient!: TblChildren;

  @Column({
    type: "integer",
    name: "prescribedPrescriptionFileId",
    nullable: true,
  })
  prescribedPrescriptionFileId!: number;
  @OneToOne(
    () => TblPrescribedPrescriptionFile,
    (tblPrescribedPrescriptionFile) =>
      tblPrescribedPrescriptionFile.prescription,
  )
  @JoinColumn([
    { name: "prescribedPrescriptionFileId", referencedColumnName: "id" },
  ])
  prescribedPrescriptionFile?: TblPrescribedPrescriptionFile;

  @Column({ type: "smallint", name: "statusId" })
  statusId!: number;
  @ManyToOne(
    () => TblPrescriptionStatus,
    (tblPrescriptionStatus) => tblPrescriptionStatus.prescriptions,
  )
  @JoinColumn([{ name: "statusId", referencedColumnName: "id" }])
  status!: TblPrescriptionStatus;

  @Column({ type: "smallint", name: "visitTypeId", nullable: true })
  visitTypeId: number;
  @ManyToOne(
    () => TblPrescriptionVisitType,
    (tblPrescriptionVisitType) => tblPrescriptionVisitType.prescriptions,
  )
  @JoinColumn([{ name: "visitTypeId", referencedColumnName: "id" }])
  prescriptionVisitType!: TblPrescriptionVisitType;

  @OneToMany(
    () => TblPrescriptionPatientFile,
    (tblPrescriptionPatientFile) => tblPrescriptionPatientFile.prescription,
  )
  prescriptionPatientFiles!: TblPrescriptionPatientFile[];

  @OneToMany(
    () => TblPediatricianSubPrescription,
    (tblPediatricianSubPrescription) =>
      tblPediatricianSubPrescription.pediatrician,
  )
  pediatricianSubPrescriptions!: TblPediatricianSubPrescription[];

  constructor(init?: Partial<TblPrescription>) {
    Object.assign(this, init);
  }
}
