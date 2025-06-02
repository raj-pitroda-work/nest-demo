import { Module } from "@nestjs/common";
import { LookupController } from "./lookup.controller";
import { LookupService } from "./lookup.service";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblCity } from "src/entities/TblCity.entity";
import { TblMedicineDosage } from "src/entities/TblMedicineDosage.entity";
import { TblPrescriptionPediatricianRejectStatus } from "src/entities/TblPrescriptionPediatricianRejectStatus.entity";
import { TblChildren } from "src/entities/TblChildren.entity";
import { TblPrescriptionDiagnosis } from "src/entities/TblPrescriptionDiagnosis.entity";
import { TblPrescriptionVisitType } from "src/entities/TblPrescriptionVisitType.entity";
import { TblPrescriptionServiceTipAccess } from "src/entities/TblPrescriptionServiceTipAccess.entity";
import { TblPrescriptionServicePriority } from "src/entities/TblPrescriptionServicePriority.entity";
import { TblExemption } from "src/entities/TblExemption.entity";

@Module({
  imports: [
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([
      TblCity,
      TblChildren,
      TblMedicineDosage,
      TblPrescriptionPediatricianRejectStatus,
      TblPrescriptionDiagnosis,
      TblPrescriptionVisitType,
      TblPrescriptionServiceTipAccess,
      TblPrescriptionServicePriority,
      TblExemption,
    ]),
  ], // Assuming no specific entities are used in Lookup
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
