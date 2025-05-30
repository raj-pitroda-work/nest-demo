import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TblUser } from "src/entities/TblUser.entity";
import { throwCustomError } from "src/exceptions/customException";
import { bCrypt, bCryptCompare } from "src/utils/helperFun";
import { msg } from "src/utils/msg";
import { DataSource, ObjectLiteral, QueryRunner } from "typeorm";
import { LoginDTO, VerifyLoginOtpDTO } from "./authDto";
import * as moment from "moment";
import { USER_ROLE_IDS } from "src/utils/constant";
import {
  RegisterParentDTO,
  RegisterPediatricianDTO,
  RegisterUserDTO,
} from "./userDTO/registerUserDTO";
import { plainToInstance } from "class-transformer";
import { TblUserIdentityImages } from "src/entities/TblUserIdentityImages.entity";
import { TblChildrenPediatrician } from "src/entities/TblChildrenPediatrician.entity";
import { TblChildren } from "src/entities/TblChildren.entity";
import { TblPediatricianProfessionalData } from "src/entities/TblPediatricianProfessionalData.entity";
import { UserService } from "../user/user.service";
import { UploadedFile } from "express-fileupload";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    private userService: UserService,
  ) {}

  generateToken = async (data: ObjectLiteral): Promise<string> => {
    const token = await this.jwtService.signAsync({ ...data });

    return token;
  };

  login = async (loginData: LoginDTO): Promise<string> => {
    const exUser = await this.userService.userRepo.findOne({
      where: { email: loginData.email },
    });
    if (!exUser) throwCustomError(msg.userNotFound, HttpStatus.BAD_REQUEST);

    if (!(await bCryptCompare(loginData.password, exUser.password)))
      throwCustomError(msg.inCorrectPassword, HttpStatus.BAD_REQUEST);

    try {
      // await sendEmail();
      await this.userService.update(exUser.id, {
        ...exUser,
        otp: "1234",
        otpCreatedAt: new Date(),
      });
    } catch (e: any) {
      throwCustomError(e);
    }
    return exUser.email;
  };

  verifyOtp = async (
    verifyOtpData: VerifyLoginOtpDTO,
  ): Promise<{ token: string; user: TblUser & { isParent: boolean } }> => {
    const exUser = await this.userService.userRepo.findOne({
      where: { email: verifyOtpData.email },
    });
    if (!exUser) throwCustomError(msg.userNotFound, HttpStatus.BAD_REQUEST);

    if (!(await bCryptCompare(verifyOtpData.password, exUser.password)))
      throwCustomError(msg.inCorrectPassword, HttpStatus.BAD_REQUEST);

    if (!exUser.otpCreatedAt) throwCustomError(msg.otpNotAvailable);

    const tokenCreatedAtMoment = moment(exUser.otpCreatedAt);
    const now = moment();

    if (now.diff(tokenCreatedAtMoment, "minutes") >= 1000000) {
      throwCustomError(msg.otpExpired);
    }

    if (exUser.otp !== verifyOtpData.otp) throwCustomError(msg.otpInvalid);

    const userData = Object.assign(exUser, {
      password: undefined,
      img: undefined,
    });
    const token = await this.generateToken(userData);

    const userDetails = await this.userService.getUserDetailsById(exUser.id);
    return {
      token,
      user: {
        ...userDetails,
        isParent: userDetails.roleId === USER_ROLE_IDS.parent,
      },
    };
  };

  registerPediatrician = async (
    registerDTO: RegisterPediatricianDTO,
    profImg: UploadedFile,
    frontIdentityImage: UploadedFile,
    backIdentityImage: UploadedFile,
  ): Promise<TblUser> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const newUser = await this.createUserAsRegister(
        queryRunner,
        registerDTO,
        profImg,
        frontIdentityImage,
        backIdentityImage,
        USER_ROLE_IDS.pediatrician,
      );
      const professData = plainToInstance(TblPediatricianProfessionalData, {
        ...registerDTO,
        user: { id: newUser.id },
      });

      await queryRunner.manager.save(professData);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return newUser;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throwCustomError(error);
    }
  };

  registerParent = async (
    registerDTO: RegisterParentDTO,
    profParentImg: UploadedFile,
    parentFrontImg: UploadedFile,
    parentBackImg: UploadedFile,
    childFrontImgs: UploadedFile[],
    childBackImgs: UploadedFile[],
    childProfImage: UploadedFile[],
  ): Promise<TblUser> => {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const parentNewUser = await this.createUserAsRegister(
        queryRunner,
        registerDTO.parent,
        profParentImg,
        parentFrontImg,
        parentBackImg,
        USER_ROLE_IDS.parent,
      );

      const newChildren: TblChildren[] = [];
      for (let index = 0; index < registerDTO.child?.length; index++) {
        const childData = registerDTO.child[index];
        const frontBase64 = childFrontImgs[index].data.toString("base64");
        const backBase64 = childBackImgs[index].data.toString("base64");
        const childBase64 = childProfImage[index].data.toString("base64");

        const identityChildData = plainToInstance(TblUserIdentityImages, {
          frontBase64,
          backBase64,
        });
        const identityImgResult =
          await queryRunner.manager.save(identityChildData);

        const newChild = plainToInstance(TblChildren, {
          ...childData,
          userIdentityImage: { id: identityImgResult.id },
          parent: { id: parentNewUser.id },
          placeOfBirthCity: { id: childData.placeOfBirthCityId },
          img: childBase64,
        });
        newChildren.push(newChild);
      }
      const childResult = await queryRunner.manager.save(newChildren);

      const childPediatricians: TblChildrenPediatrician[] = [];
      childResult.forEach((child, index) => {
        const childData = registerDTO.child[index];
        childData.pediatricianIds.forEach((pediaId) => {
          const childPediatrician = plainToInstance(TblChildrenPediatrician, {
            child: { id: child.id },
            pediatrician: { id: pediaId },
          });
          childPediatricians.push(childPediatrician);
        });
      });

      await queryRunner.manager.save(childPediatricians);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return parentNewUser;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throwCustomError(error);
    }
  };

  createUserAsRegister = async (
    queryRunner: QueryRunner,
    registerDTO: RegisterUserDTO,
    profImg: UploadedFile,
    frontImg: UploadedFile,
    backImg: UploadedFile,
    roleId: number,
  ) => {
    const exUser = await this.userService.userRepo.findOne({
      where: { email: registerDTO.email },
    });
    if (exUser) {
      throwCustomError(
        msg.userAlreadyExistWithEmail + `: ${registerDTO.email}`,
      );
    }

    const profBase64 = profImg.data.toString("base64");
    const frontBase64 = frontImg.data.toString("base64");
    const backBase64 = backImg.data.toString("base64");

    const identityData = plainToInstance(TblUserIdentityImages, {
      frontBase64,
      backBase64,
    });
    const identityImgResult = await queryRunner.manager.save(identityData);

    const user = plainToInstance(TblUser, {
      ...registerDTO,
      roleId,
      userIdentityImageId: identityImgResult.id,
      password: await bCrypt(registerDTO.password),
      img: profBase64,
    });

    return await queryRunner.manager.save(user);
  };
}
