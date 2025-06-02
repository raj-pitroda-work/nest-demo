import { Module } from "@nestjs/common";
import { MedicineService } from "./medicine.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblMedicine } from "src/entities/TblMedicine.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TblMedicine])],
  providers: [MedicineService],
  exports: [MedicineService],
})
export class MedicineModule {}
