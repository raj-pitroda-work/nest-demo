import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, MaxLength } from "class-validator";
import { msg } from "src/utils/msg";

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150, { message: "Email length must be 150 character." })
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @Length(8, 18)
  @ApiProperty()
  password!: string;
}

export class VerifyLoginOtpDTO extends LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(4, 4, { message: msg.otpLength(4) })
  otp!: string;
}
