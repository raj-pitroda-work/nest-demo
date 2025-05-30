import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblUser } from "src/entities/TblUser.entity";
import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { throwCustomError } from "src/exceptions/customException";
import { msg } from "src/utils/msg";

@Injectable()
export class UserService extends BaseService<TblUser> {
  constructor(@InjectRepository(TblUser) public userRepo: Repository<TblUser>) {
    super(userRepo);
  }

  getUserDetailsById = async (id: number) => {
    const exUser = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.placeOfBirthCity", "placeOfBirthCity")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect(
        "user.pediatricianProfessionalData",
        "professionalData",
      )
      .leftJoinAndSelect("user.children", "children")
      .where("user.id = :id", { id })
      .getOne();

    if (!exUser) throwCustomError(msg.userNotFound, HttpStatus.BAD_REQUEST);
    Object.assign(exUser, { password: undefined });
    return exUser;
  };
}
