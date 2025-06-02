import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblChildren } from "src/entities/TblChildren.entity";
import { ChildrenService } from "./children.service";

@Module({
  imports: [TypeOrmModule.forFeature([TblChildren])],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
