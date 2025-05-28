import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblUser } from "./TblUser.entity";

@Index("tblPediatricianProfessionalData_pkey", ["id"], { unique: true })
@Entity("tblPediatricianProfessionalData", { schema: "public" })
export class TblPediatricianProfessionalData {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "registrationNo", length: 50 })
  registrationNo!: string;

  @Column("character varying", { name: "regionalCode", length: 50 })
  regionalCode!: string;

  @Column("character varying", { name: "aslCode", length: 20 })
  aslCode!: string;

  @Column("character varying", { name: "vatNo", length: 20 })
  vatNo!: string;

  @Column("character", { name: "sdiCode", length: 50 })
  sdiCode!: string;

  @Column("character varying", { name: "pecCode", length: 50 })
  pecCode!: string;

  @OneToOne(() => TblUser, (tblUser) => tblUser.pediatricianProfessionalData)
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user!: TblUser;
}
