import { Module } from "@nestjs/common";
import { PrescriptionController } from "./prescription.controller";
import { PrescriptionService } from "./prescription.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblPrescription } from "src/entities/TblPrescription.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TblPrescription])],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
