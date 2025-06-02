import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblService } from "src/entities/TblService.entity";
import { ServiceService } from "./service.service";

@Module({
  imports: [TypeOrmModule.forFeature([TblService])],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
