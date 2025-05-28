import { Body, Post } from "@nestjs/common";
import { ApiController, Public } from "src/decorators/customDecorator";
import { IApiResponse } from "src/types/commonType";
import { AuthService } from "./auth.service";
import { LoginDto } from "./authDto";
import { ApiOkResponse } from "@nestjs/swagger";

@ApiController("auth")
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOkResponse({ type: LoginDto })
  login(@Body() loginDto: LoginDto): IApiResponse<any> {
    const result = this.authService.login(loginDto);
    return {
      data: result,
      message: "Login successful",
    };
  }
}
