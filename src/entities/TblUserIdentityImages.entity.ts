import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblChildren } from "./TblChildren.entity";
import { TblUser } from "./TblUser.entity";

@Index("tblUserIdentityImages_pkey", ["id"], { unique: true })
@Entity("tblUserIdentityImages", { schema: "public" })
export class TblUserIdentityImages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("text", { name: "frontBase64" })
  frontBase64!: string;

  @Column("text", { name: "backBase64", nullable: true })
  backBase64!: string;

  @OneToOne(() => TblChildren, (tblChildren) => tblChildren.userIdentityImage)
  tblChildren!: TblChildren;

  @OneToOne(() => TblUser, (tblUser) => tblUser.userIdentityImage)
  tblUsers!: TblUser;
}
