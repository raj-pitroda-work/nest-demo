import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblChildren } from "./TblChildren.entity";
import { TblUser } from "./TblUser.entity";

@Index("tblCity_pkey", ["id"], { unique: true })
@Entity("tblCity", { schema: "public" })
export class TblCity {
  @PrimaryGeneratedColumn({ type: "smallint", name: "id" })
  id!: number;

  @Column("character varying", { name: "name", length: 50 })
  name!: string;

  @OneToMany(() => TblChildren, (tblChildren) => tblChildren.placeOfBirthCity)
  tblChildren!: TblChildren[];

  @OneToMany(() => TblUser, (tblUser) => tblUser.placeOfBirthCity)
  tblUsers!: TblUser[];
}
