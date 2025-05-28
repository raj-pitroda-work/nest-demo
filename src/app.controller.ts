import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { IApiResponse } from "./types/commonType";
import { CreateUserDto } from "./entities/TblUser.entity";
import { Role } from "./decorators/customDecorator";
import { RoleEnum } from "./utils/constant";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Role([RoleEnum.SuperAdmin, RoleEnum.Admin])
  getHello(): IApiResponse<string> {
    return { data: this.appService.getHello() };
  }

  @Post()
  createDemoApi(@Body() body: CreateUserDto): IApiResponse<any> {
    return { data: body };
  }
}
