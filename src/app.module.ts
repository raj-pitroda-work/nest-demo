import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getDatabaseConfig } from "./config/db.config";
import { AuthModule } from "./modules/auth/auth.module";
import { RoleModule } from "./modules/role/role.module";
import { UserModule } from "./modules/user/user.module";
import { LookupModule } from "./modules/lookup/lookup.module";
import { ParentModule } from "./modules/parent/parent.module";
import { PediatricianModule } from "./modules/pediatrician/pediatrician.module";
import { MedicineModule } from "./modules/medicine/medicine.module";
import { ChildrenModule } from "./modules/children/children.module";
import { LaboratoryModule } from "./modules/laboratory/laboratory.module";
import { PrescriptionModule } from "./modules/prescription/prescription.module";
import { ServiceModule } from "./modules/service/service.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    LookupModule,
    AuthModule,
    RoleModule,

    UserModule,
    ParentModule,
    ChildrenModule,
    LaboratoryModule,
    MedicineModule,
    PediatricianModule,
    PrescriptionModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
