import { Module } from "@nestjs/common";
import { ParentController } from "./parent.controller";
import { ParentService } from "./parent.service";

@Module({
  imports: [],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
