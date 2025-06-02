import { Get } from "@nestjs/common";
import { ApiController, Public, User } from "src/decorators/customDecorator";
import { IOption, IPromiseApiResponse } from "src/types/commonType";
import { LookupService } from "./lookup.service";
import { ObjectLiteral } from "typeorm";

@ApiController("lookup")
export class LookupController {
  constructor(private readonly service: LookupService) {}
  @Public()
  @Get("getRoles")
  async getRoles(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getRoles();
    return { data: result };
  }

  @Get("getCities")
  @Public()
  async getCities(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getCities();
    return { data: result };
  }

  @Get("getPediatricians")
  @Public()
  async getPediatricians(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getPediatricians();
    return { data: result };
  }

  @Get("getRejectReasons")
  async getRejectReasons(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getRejectReasons();
    return { data: result };
  }

  @Get("getPosologies")
  async getPosologies(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getPosologies();
    return { data: result };
  }

  @Get("getPediatriciansLookupsByParentId")
  async getPediatriciansLookupsByParentId(
    @User("id") id: number,
  ): IPromiseApiResponse<{
    [key: number]: {
      lookups: {
        value: number;
        label: string;
      }[];
      prescriptionCount: ObjectLiteral;
    };
  }> {
    const result = await this.service.getPediatriciansLookupsByParentId(id);
    return { data: result };
  }

  @Get("getVisitTypes")
  async getVisitTypes(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getVisitTypes();
    return { data: result };
  }

  @Get("getDiagnosis")
  async getDiagnosis(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getDiagnosis();
    return { data: result };
  }

  @Get("getPrescriptionServiceTipAccess")
  async getPrescriptionServiceTipAccess(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getPrescriptionServiceTipAccess();
    return { data: result };
  }

  @Get("getPrescriptionServicePriority")
  async getPrescriptionServicePriority(): IPromiseApiResponse<IOption[]> {
    const result = await this.service.getPrescriptionServicePriority();
    return { data: result };
  }

  @Get("getExemption")
  async getExemption(): IPromiseApiResponse<any[]> {
    const result = await this.service.getExemption();
    return { data: result };
  }
}
