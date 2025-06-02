import { Module } from "@nestjs/common";
import { PediatricianController } from "./pediatrician.controller";
import { PediatricianService } from "./pediatrician.service";
import { MedicineModule } from "../medicine/medicine.module";
import { ServiceModule } from "../service/service.module";
import { LaboratoryModule } from "../laboratory/laboratory.module";
import { ChildrenModule } from "../children/children.module";
import { PrescriptionModule } from "../prescription/prescription.module";

@Module({
  imports: [
    MedicineModule,
    PrescriptionModule,
    ServiceModule,
    LaboratoryModule,
    ChildrenModule,
  ],
  controllers: [PediatricianController],
  providers: [PediatricianService],
})
export class PediatricianModule {}
