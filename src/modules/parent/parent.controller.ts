import { ApiController, User } from "src/decorators/customDecorator";
import { ParentService } from "./parent.service";
import { IPromiseApiResponse } from "src/types/commonType";
import { msg } from "src/utils/msg";
import { Request } from "express";
import { Body, Get, Param, ParseIntPipe, Post, Req } from "@nestjs/common";
import { throwCustomError } from "src/exceptions/customException";
import { TblPrescription } from "src/entities/TblPrescription.entity";
import { IParentPrescriptions } from "./parent.type";

@ApiController("parent")
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post("getPrescriptions/:childId/:pediatricianId")
  async getPrescriptions(
    @User("id") parentId: number,
    @Param("childId", ParseIntPipe) childId: number,
    @Param("pediatricianId", ParseIntPipe) pediatricianId: number,
    @Body("status") status: string,
  ): IPromiseApiResponse<IParentPrescriptions[]> {
    const result = await this.parentService.getPrescriptions(
      parentId,
      childId,
      pediatricianId,
      status,
    );
    return { data: result };
  }

  @Post("cancelPrescription/:id")
  async cancelPrescription(
    @Param("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<TblPrescription> {
    const result = await this.parentService.cancelPrescription(id);
    return { data: result, message: msg.recordUpdateSuccess };
  }

  @Get("getPrescriptionDetail/:id")
  async getPrescriptionDetail(
    @Param("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<TblPrescription> {
    const result = await this.parentService.getPrescriptionDetail(id);
    return { data: result, message: msg.recordUpdateSuccess };
  }

  @Post("createNewPrescription")
  async createNewPrescriptionRequest(
    @Req() req: Request,
    @User("id") id: number,
  ): IPromiseApiResponse<TblPrescription> {
    let files = req.files?.medicalReportFiles;
    if (!files) {
      throwCustomError(msg.uploadMedicalReport);
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    const result = await this.parentService.createNewPrescriptionRequest(
      req.body,
      files,
      id,
    );
    return { data: result, message: msg.prescriptionRequestSuccess };
  }

  @Post("updatePrescriptionRequest/:id")
  async updatePrescriptionRequest(
    @Req() req: Request,
    @Param("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<TblPrescription> {
    let files = req.files?.medicalReportFiles;
    if (!files) {
      throwCustomError(msg.uploadMedicalReport);
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    const result = await this.parentService.updatePrescriptionRequest(
      id,
      req.body,
      files,
    );
    return { data: result, message: msg.recordUpdateSuccess };
  }
}
