import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblBranch } from "./TblBranch.entity";
import { TblLaboratory } from "./TblLaboratory.entity";

@Index("tblLaboratoryBranch_pkey", ["id"], { unique: true })
@Entity("tblLaboratoryBranch", { schema: "public" })
export class TblLaboratoryBranch {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("integer", { name: "branchId" })
  branchId!: number;
  @ManyToOne(() => TblBranch, (tblBranch) => tblBranch.laboratoryBranches)
  @JoinColumn([{ name: "branchId", referencedColumnName: "id" }])
  branch!: TblBranch;

  @Column("integer", { name: "laboratoryId" })
  laboratoryId!: number;
  @ManyToOne(
    () => TblLaboratory,
    (tblLaboratory) => tblLaboratory.laboratoryBranches,
  )
  @JoinColumn([{ name: "laboratoryId", referencedColumnName: "id" }])
  laboratory!: TblLaboratory;
}
