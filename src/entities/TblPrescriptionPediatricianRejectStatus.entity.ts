import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tblPrescriptionPediatricianRejectStatus_pkey", ["id"], { unique: true })
@Entity("tblPrescriptionPediatricianRejectStatus", { schema: "public" })
export class TblPrescriptionPediatricianRejectStatus {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "reason", length: 50 })
  reason!: string;
}
