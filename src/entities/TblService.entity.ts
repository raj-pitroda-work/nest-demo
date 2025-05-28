import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblPrescriptionService } from "./TblPrescriptionService.entity";
import { TblServiceBranch } from "./TblServiceBranch.entity";

@Index("tblService_pkey", ["id"], { unique: true })
@Entity("tblService", { schema: "public" })
export class TblService {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 200 })
  name!: string;

  @Column("character varying", { name: "nomen", length: 100 })
  nomen!: string;

  @Column("numeric", { name: "priceInEuro", precision: 10, scale: 2 })
  priceInEuro!: string;

  @Column("integer", { name: "cRegNo" })
  cRegNo!: number;

  @OneToMany(
    () => TblServiceBranch,
    (tblServiceBranch) => tblServiceBranch.service,
  )
  serviceBranches!: TblServiceBranch[];

  @OneToMany(
    () => TblPrescriptionService,
    (tblPrescriptionService) => tblPrescriptionService.service,
  )
  prescriptionServices!: TblPrescriptionService[];
}
