import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { TblRole } from "src/entities/TblRole.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([TblRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
