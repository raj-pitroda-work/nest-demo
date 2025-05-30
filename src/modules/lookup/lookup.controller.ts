import { Get } from "@nestjs/common";
import { ApiController, Public, User } from "src/decorators/customDecorator";
import { IOption, IPromiseApiResponse } from "src/types/commonType";
import { LookupService } from "./lookup.service";

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
      prescriptionCount: number;
    };
  }> {
    const result = await this.service.getPediatriciansLookupsByParentId(id);
    return { data: result };
  }
}
