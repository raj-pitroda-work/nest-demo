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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    RoleModule,
    UserModule,
    LookupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
