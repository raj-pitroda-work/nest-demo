import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tblMedicineIrreplaceableReason_pkey", ["id"], { unique: true })
@Entity("tblMedicineIrreplaceableReason", { schema: "public" })
export class TblMedicineIrreplaceableReason {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "reason", length: 100 })
  reason!: string;
}
