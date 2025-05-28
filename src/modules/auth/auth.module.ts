import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import jwtConfig from "src/config/jwt.config";

@Module({
  imports: [PassportModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
