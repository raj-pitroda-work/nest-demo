import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblChildren } from "./TblChildren.entity";
import { TblUser } from "./TblUser.entity";

@Index("tblChildrenPediatrician_pkey", ["id"], { unique: true })
@Entity("tblChildrenPediatrician", { schema: "public" })
export class TblChildrenPediatrician {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @ManyToOne(
    () => TblChildren,
    (tblChildren) => tblChildren.childrenPediatricians,
  )
  @JoinColumn([{ name: "childId", referencedColumnName: "id" }])
  child!: TblChildren;

  @ManyToOne(() => TblUser, (tblUser) => tblUser.tblChildrenPediatricians)
  @JoinColumn([{ name: "pediatricianId", referencedColumnName: "id" }])
  pediatrician!: TblUser;
}
