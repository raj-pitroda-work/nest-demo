import { Module } from "@nestjs/common";
import { ParentController } from "./parent.controller";
import { ParentService } from "./parent.service";
import { PrescriptionModule } from "../prescription/prescription.module";

@Module({
  imports: [PrescriptionModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
