import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblUser } from "./TblUser.entity";

@Index("tblRole_pkey", ["id"], { unique: true })
@Entity("tblRole", { schema: "public" })
export class TblRole {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 50 })
  name!: string;

  @OneToMany(() => TblUser, (tblUser) => tblUser.role)
  tblUsers!: TblUser[];
}
