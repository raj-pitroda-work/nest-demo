import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("tblRole_pkey", ["id"], { unique: true })
@Entity("tblRole", { schema: "public" })
export class TblRole {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 50 })
  name: string;
}
