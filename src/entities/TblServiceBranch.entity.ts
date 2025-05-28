import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblBranch } from "./TblBranch.entity";
import { TblService } from "./TblService.entity";

@Index("tblServiceBranch_pkey", ["id"], { unique: true })
@Entity("tblServiceBranch", { schema: "public" })
export class TblServiceBranch {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("integer", { name: "branchId" })
  branchId!: number;
  @ManyToOne(() => TblBranch, (tblBranch) => tblBranch.serviceBranches)
  @JoinColumn([{ name: "branchId", referencedColumnName: "id" }])
  branch!: TblBranch;

  @Column("integer", { name: "branchId" })
  serviceId!: number;
  @ManyToOne(() => TblService, (tblService) => tblService.serviceBranches)
  @JoinColumn([{ name: "serviceId", referencedColumnName: "id" }])
  service!: TblService;
}
