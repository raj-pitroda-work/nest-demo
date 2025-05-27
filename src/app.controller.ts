import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { IApiResponse } from "./types/commonType";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): IApiResponse<string> {
    return { data: this.appService.getHello() };
  }
}
