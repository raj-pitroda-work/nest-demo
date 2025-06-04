import { Body, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiController } from "src/decorators/customDecorator";
import { CreatePtExemptionDto } from "./ptExemption.dto";
import { PtExemptionService } from "./ptExemption.service";
import { msg } from "src/utils/msg";
import * as moment from "moment";
import { BE_DATE_FORMAT } from "src/utils/constant";

@ApiController("patientExemption")
export class PtExemptionController {
  constructor(private readonly ptExemptionService: PtExemptionService) {}

  @Post("createPtExemption")
  async createPtExemption(@Body() data: CreatePtExemptionDto) {
    const result = await this.ptExemptionService.create({
      ...data,
      startDate: moment(data.startDate, BE_DATE_FORMAT).toDate(),
      endDate: moment(data.endDate, BE_DATE_FORMAT).toDate(),
    });
    return {
      message: msg.ptExemptionCreateSuccess,
      data: result,
    };
  }

  @Get("getPtExemptionLookups/:id")
  async getPtExemptionLookups(@Param("id", ParseIntPipe) id: number) {
    const result = await this.ptExemptionService.getPtExemptionLookups(id);
    return {
      message: msg.ptExemptionCreateSuccess,
      data: result,
    };
  }
}
