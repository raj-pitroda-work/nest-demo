import { Module } from "@nestjs/common";
import { PtExemptionService } from "./ptExemption.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblPatientExemption } from "src/entities/TblPatientExemption.entity";
import { PtExemptionController } from "./ptExemption.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TblPatientExemption])],
  controllers: [PtExemptionController],
  providers: [PtExemptionService],
  exports: [PtExemptionService],
})
export class PatientExemptionModule {}
