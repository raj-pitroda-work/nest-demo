import { Body, Get, Param, Post, Query } from "@nestjs/common";
import { ApiController, User } from "src/decorators/customDecorator";
import { IPromiseApiResponse, ITokenUser } from "src/types/commonType";
import { msg } from "src/utils/msg";
import { PediatricianService } from "./pediatrician.service";
import {
  CreateElPrescriptionDTO,
  CreateElWhitePrescriptionDTO,
} from "./pediatricianDto/elWhitePrescriptionDTO";
import { RejectPrescriptionDTO } from "./pediatricianDto/rejectPrescriptionDTO";

@ApiController("pediatrician")
export class PediatricianController {
  constructor(private readonly service: PediatricianService) {}
  @Get("getPediatricianPrescriptionCount")
  async getPediatricianPrescriptionCount(
    @User("id") id: number,
  ): IPromiseApiResponse<any> {
    const result = await this.service.pediatricianPrescriptionCount(Number(id));
    return { data: result };
  }

  @Post("markPrescriptionInProgress/:id")
  async markPrescriptionInProgress(
    @Param("id") id: number,
  ): IPromiseApiResponse<any> {
    const result = await this.service.markPrescriptionInProgress(Number(id));
    return { data: result };
  }

  @Post("rejectPrescriptionByPediatrician")
  async rejectPrescriptionByPediatrician(
    @Body() body: RejectPrescriptionDTO,
  ): IPromiseApiResponse<any> {
    const result = await this.service.rejectPrescriptionByPediatrician(body);
    return { data: result, message: msg.rejectSuccess };
  }

  @Post("getPrescriptionByPediatrician")
  async getPrescriptionByPediatricianId(
    @User("id") id: number,
    @Body("status") status: string,
  ): IPromiseApiResponse<any> {
    const result = await this.service.getPrescriptionByPediatricianId(
      Number(id),
      status ?? "",
    );
    return { data: result };
  }

  @Get("getPediatricianPrescriptionById/:id")
  async getPrescriptionById(@Param("id") id: number): IPromiseApiResponse<any> {
    const result = await this.service.getPrescriptionById(Number(id));
    return { data: result };
  }

  @Get("getMedicines")
  async getMedicines(
    @Query("search") search: string,
  ): IPromiseApiResponse<any> {
    const result = await this.service.getMedicines(search?.toString());
    return { data: result };
  }

  @Get("getServices")
  async getServices(@Query("search") search: string): IPromiseApiResponse<any> {
    const result = await this.service.getServices(search?.toString());
    return { data: result };
  }

  @Get("getLabs")
  async getLabs(@Query("search") search: string): IPromiseApiResponse<any> {
    const result = await this.service.getLabs(search?.toString());
    return { data: result };
  }

  @Post("createElWhitePrescription")
  async createElWhitePrescription(
    @Body() body: CreateElWhitePrescriptionDTO,
    @User() user: ITokenUser,
  ): IPromiseApiResponse<any> {
    const result = await this.service.createElWhitePrescription(body, user!);
    return { data: result, message: msg.prescriptionSaveSuccess };
  }

  @Post("createElPrescription")
  async createElPrescription(
    @Body() body: CreateElPrescriptionDTO,
    @User() user: ITokenUser,
  ): IPromiseApiResponse<any> {
    const result = await this.service.createElPrescription(body, user!);
    return { data: result, message: msg.prescriptionSaveSuccess };
  }
}
