import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TblUser } from "./TblUser.entity";
import { TblCity } from "./TblCity.entity";
import { TblUserIdentityImages } from "./TblUserIdentityImages.entity";
import { TblChildrenPediatrician } from "./TblChildrenPediatrician.entity";
import { TblPrescription } from "./TblPrescription.entity";
import { TblPatientExemption } from "./TblPatientExemption.entity";

@Index("tblChildren_pkey", ["id"], { unique: true })
@Entity("tblChildren", { schema: "public" })
export class TblChildren {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "firstName", length: 80 })
  firstName!: string;

  @Column("character varying", { name: "lastName", length: 80 })
  lastName!: string;

  @Column("date", { name: "dob" })
  dob!: string;

  @Column("character varying", { name: "gender", length: 10 })
  gender!: string;

  @Column("character varying", { name: "taxCode", length: 16 })
  taxCode!: string;

  @Column("text", { name: "img" })
  img!: string;

  @ManyToOne(() => TblUser, (tblUser) => tblUser.children)
  @JoinColumn([{ name: "parentId", referencedColumnName: "id" }])
  parent!: TblUser;

  @ManyToOne(() => TblCity, (tblCity) => tblCity.tblChildren)
  @JoinColumn([{ name: "placeOfBirthICityId", referencedColumnName: "id" }])
  placeOfBirthCity!: TblCity;

  @OneToOne(
    () => TblUserIdentityImages,
    (tblUserIdentityImages) => tblUserIdentityImages.tblChildren,
  )
  @JoinColumn([{ name: "userIdentityImageId", referencedColumnName: "id" }])
  userIdentityImage!: TblUserIdentityImages;

  @OneToMany(
    () => TblChildrenPediatrician,
    (tblChildrenPediatrician) => tblChildrenPediatrician.child,
  )
  childrenPediatricians!: TblChildrenPediatrician[];

  @OneToMany(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.patient,
  )
  prescriptions?: TblPrescription[];

  @OneToMany(
    () => TblPatientExemption,
    (tblPatientExemption) => tblPatientExemption.patient,
  )
  patientExemptions!: TblPatientExemption[];
}
