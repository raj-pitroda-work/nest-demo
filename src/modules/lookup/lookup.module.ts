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

@Module({
  imports: [
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([
      TblCity,
      TblChildren,
      TblMedicineDosage,
      TblPrescriptionPediatricianRejectStatus,
    ]),
  ], // Assuming no specific entities are used in Lookup
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
