import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./authDto";
import { AuthService } from "./auth.service";
import { IApiResponse } from "src/types/commonType";
import { Public } from "src/decorators/customDecorator";

@Controller("auth")
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: LoginDto): IApiResponse<any> {
    const result = this.authService.login(loginDto);
    return {
      data: result,
      message: "Login successful",
    };
  }
}
