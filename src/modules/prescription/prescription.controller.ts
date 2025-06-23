import { Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiController } from "src/decorators/customDecorator";
import { PrescriptionService } from "./prescription.service";
import { IPromiseApiResponse } from "src/types/commonType";

@ApiController("prescription")
export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}
  @Get("getPrescribedPrescriptionBase64/:id")
  async getPrescribedPrescriptionBase64(
    @Param("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<string> {
    const base64 =
      await this.prescriptionService.getPrescribedPrescriptionBase64(id);
    return { data: base64 };
  }
}
