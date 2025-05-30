import { ApiController, User } from "src/decorators/customDecorator";
import { ParentService } from "./parent.service";
import { IPromiseApiResponse } from "src/types/commonType";
import { msg } from "src/utils/msg";
import { Request } from "express";
import { Post, Req } from "@nestjs/common";
import { throwCustomError } from "src/exceptions/customException";
import { TblPrescription } from "src/entities/TblPrescription.entity";

@ApiController("parent")
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

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
}
