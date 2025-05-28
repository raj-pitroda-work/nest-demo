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
import { TblChildren } from "./TblChildren.entity";
import { TblChildrenPediatrician } from "./TblChildrenPediatrician.entity";
import { TblPediatricianProfessionalData } from "./TblPediatricianProfessionalData.entity";
import { TblCity } from "./TblCity.entity";
import { TblRole } from "./TblRole.entity";
import { TblUserIdentityImages } from "./TblUserIdentityImages.entity";
import { TblPrescription } from "./TblPrescription.entity";
import { TblPediatricianSubPrescription } from "./TblPediatricianSubPrescription.entity";

@Index("tblUser_pkey", ["id"], { unique: true })
@Entity("tblUser", { schema: "public" })
export class TblUser {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id!: number;

  @Column("character varying", { name: "email", length: 150 })
  email!: string;

  @Column("character varying", { name: "firstName", length: 80 })
  firstName!: string;

  @Column("character varying", { name: "lastName", length: 80 })
  lastName!: string;

  @Column("date", { name: "dob" })
  dob!: string;

  @Column("character varying", { name: "taxCode", length: 16 })
  taxCode!: string;

  @Column("character varying", { name: "password", length: 80 })
  password!: string;

  @Column("timestamp with time zone", {
    name: "createdAt",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date | null;

  @Column("text", { name: "img" })
  img!: string;

  @Column("character varying", { name: "otp", nullable: true, length: 6 })
  otp?: string | null;

  @Column("timestamp with time zone", {
    name: "otpCreatedAt",
    nullable: true,
  })
  otpCreatedAt?: Date | null;

  @OneToOne(
    () => TblPediatricianProfessionalData,
    (pediatricianProfessionalData) => pediatricianProfessionalData.user,
  )
  pediatricianProfessionalData!: TblPediatricianProfessionalData;

  @OneToMany(() => TblChildren, (children) => children.parent)
  children!: TblChildren[];

  @OneToMany(
    () => TblChildrenPediatrician,
    (tblChildrenPediatrician) => tblChildrenPediatrician.pediatrician,
  )
  tblChildrenPediatricians!: TblChildrenPediatrician[];

  @Column({ type: "smallint", name: "placeOfBirthCityId" })
  placeOfBirthCityId!: number;

  @ManyToOne(() => TblCity, (tblCity) => tblCity.tblUsers)
  @JoinColumn([{ name: "placeOfBirthCityId", referencedColumnName: "id" }])
  placeOfBirthCity!: TblCity;

  @Column("integer", { name: "roleId" })
  roleId!: number;
  @ManyToOne(() => TblRole, (tblRole) => tblRole.tblUsers)
  @JoinColumn([{ name: "roleId", referencedColumnName: "id" }])
  role!: TblRole;

  @Column("integer", { name: "userIdentityImageId" })
  userIdentityImageId!: number;

  @OneToOne(
    () => TblUserIdentityImages,
    (tblUserIdentityImages) => tblUserIdentityImages.tblUsers,
  )
  @JoinColumn([{ name: "userIdentityImageId", referencedColumnName: "id" }])
  userIdentityImage!: TblUserIdentityImages;

  @OneToMany(
    () => TblPrescription,
    (tblPrescription) => tblPrescription.pediatrician,
  )
  prescriptions!: TblPrescription[];

  @OneToMany(() => TblPrescription, (tblPrescription) => tblPrescription.parent)
  parentPrescriptions!: TblPrescription[];

  @OneToMany(
    () => TblPediatricianSubPrescription,
    (tblPediatricianSubPrescription) =>
      tblPediatricianSubPrescription.pediatrician,
  )
  pediatricianSubPrescriptions!: TblPediatricianSubPrescription[];
}
