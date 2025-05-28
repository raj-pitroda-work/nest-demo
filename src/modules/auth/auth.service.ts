import { Injectable } from "@nestjs/common";
import { LoginDto } from "./authDto";
import { throwCustomError } from "src/exceptions/customException";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login = (loginDto: LoginDto) => {
    const { email, password } = loginDto;
    if (email === "rj@rj.com" && password === "123456") {
      return { loginDto, token: this.jwtService.sign(loginDto) };
    } else {
      throwCustomError("Invalid credentials", 401);
    }
  };
}
