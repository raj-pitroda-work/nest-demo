import { Body, Post, Req, Res } from "@nestjs/common";
import { ApiController, Public } from "src/decorators/customDecorator";
import { IPromiseApiResponse } from "src/types/commonType";
import { AuthService } from "./auth.service";
import { msg } from "src/utils/msg";
import { LoginDTO, VerifyLoginOtpDTO } from "./authDto";
import { TOKEN_VAR_ENUM } from "src/utils/constant";
import { Request, Response } from "express";
import { throwCustomError } from "src/exceptions/customException";
import { TblUser } from "src/entities/TblUser.entity";
import { UploadedFile } from "express-fileupload";
import { RegisterParentDTO } from "./userDTO/registerUserDTO";
import { validateDto } from "src/utils/modelValidator";

@ApiController("auth")
@Public()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("login")
  async login(@Body() body: LoginDTO): IPromiseApiResponse<null> {
    const result = await this.service.login(body);
    return { message: msg.otpSentToEmail + ": " + result };
  }

  @Post("verifyOtp")
  async verifyOtp(
    @Res({ passthrough: true }) res: Response,
    @Body() body: VerifyLoginOtpDTO,
  ): IPromiseApiResponse<{ token: string; user: TblUser }> {
    const result = await this.service.verifyOtp(body);
    res.cookie(TOKEN_VAR_ENUM.Token, result.token, {
      httpOnly: false, // If you need to access it from JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //24 hours which is also expiration time of token
    });

    return {
      message: msg.loginSuccess,
      data: result,
    };
  }

  @Post("registerPediatrician")
  async registerPediatrician(
    @Req() req: Request,
  ): IPromiseApiResponse<TblUser> {
    if (!req.files) {
      throwCustomError(msg.uploadFrontAndBackIdentityImages);
    }

    const profImg = req.files.profImage as UploadedFile;
    if (!profImg) {
      throwCustomError(msg.uploadProfImg);
    }

    const frontImg = req.files.frontIdentityImage as UploadedFile;
    if (!frontImg) {
      throwCustomError(msg.uploadFrontIdentityImages);
    }

    const backImg = req.files.backIdentityImage as UploadedFile;

    if (!backImg) {
      throwCustomError(msg.uploadBackIdentityImages);
    }

    const result = await this.service.registerPediatrician(
      req.body,
      profImg,
      frontImg,
      backImg,
    );
    return { data: result, message: msg.registerSuccess };
  }

  @Post("registerParent")
  async registerParent(@Req() req: Request): IPromiseApiResponse<TblUser> {
    const files = req.files;
    if (!files) {
      throwCustomError(msg.uploadFrontAndBackIdentityImages);
    } else {
      // validation start
      let childrenData = req.body?.child;
      let parentData = req.body?.parent;
      if (childrenData && !Array.isArray(childrenData)) {
        childrenData = [childrenData];
      }
      childrenData = childrenData ? childrenData.map(JSON.parse) : undefined;
      parentData = parentData ? JSON.parse(parentData) : undefined;
      const registerData = {
        parent: parentData,
        child: childrenData,
      };
      await validateDto(RegisterParentDTO, registerData);

      const parentFront = files["parent.frontIdentityImage"];
      const parentBack = files["parent.backIdentityImage"];
      const parentProfImg = files["parent.profImage"];

      let childFronts = files["child.frontIdentityImage"];
      let childBacks = files["child.backIdentityImage"];
      let childProfImg = files["child.profImage"];

      if (!parentFront) {
        throwCustomError(msg.uploadFrontIdentityImageForParent);
      }
      if (!parentBack) {
        throwCustomError(msg.uploadBackIdentityImageForParent);
      }
      if (!parentProfImg) {
        throwCustomError(msg.uploadProfImgParent);
      }

      if (!Array.isArray(childFronts)) {
        childFronts = [childFronts];
      }

      if (!Array.isArray(childBacks)) {
        childBacks = [childBacks];
      }

      if (!Array.isArray(childProfImg)) {
        childProfImg = [childProfImg];
      }

      if (childFronts?.length !== childrenData?.length) {
        throwCustomError(msg.uploadFrontIdentityImageForChild);
      }

      if (childProfImg?.length !== childProfImg?.length) {
        throwCustomError(msg.uploadProfImageForChild);
      }

      // validation end

      const result = await this.service.registerParent(
        registerData,
        parentProfImg as UploadedFile,
        parentFront as UploadedFile,
        parentBack as UploadedFile,
        childFronts,
        childBacks,
        childProfImg,
      );
      return { data: result, message: msg.registerSuccess };
    }
  }
}
