import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
  ValidateNested,
} from "class-validator";

class Child {
  @IsNotEmpty()
  childName: string;

  @IsNotEmpty()
  @IsNumber()
  childAge: number;
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested({ each: true })
  @Type(() => Child)
  @MinLength(1)
  Child: Child[];
}
