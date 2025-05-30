import { Get, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { IPromiseApiResponse } from "src/types/commonType";
import { TblUser } from "src/entities/TblUser.entity";
import { ApiController, User } from "src/decorators/customDecorator";

@ApiController("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/getLoggedInUserDetails")
  async getLoggedInUserDetails(
    @User("id", ParseIntPipe) id: number,
  ): IPromiseApiResponse<TblUser> {
    const userId = id;
    const result = await this.userService.getUserDetailsById(userId);
    return { data: result };
  }
}
