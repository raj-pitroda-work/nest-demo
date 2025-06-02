import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblLaboratory } from "src/entities/TblLaboratory.entity";
import { LaboratoryService } from "./laboratory.service";

@Module({
  imports: [TypeOrmModule.forFeature([TblLaboratory])],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}
