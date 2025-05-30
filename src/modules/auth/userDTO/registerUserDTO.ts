import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  Length,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { LoginDTO } from "../authDto";
import { GenderEnum } from "src/utils/constant";
import { IsDDMMYYYY } from "src/decorators/pipes/dateFormatValidator";

export class RegisterUserDTO extends LoginDTO {
  @IsNotEmpty()
  @MaxLength(80)
  firstName!: string;

  @IsNotEmpty()
  @MaxLength(80)
  lastName!: string;

  @IsNotEmpty()
  @IsDDMMYYYY()
  dob!: string;

  @IsNotEmpty()
  @Length(16, 16)
  taxCode!: string;

  @IsNotEmpty()
  placeOfBirthCityId!: number;
}

export class RegisterPediatricianDTO extends RegisterUserDTO {
  @IsNotEmpty()
  @MaxLength(50)
  registrationNo!: string;

  @IsNotEmpty()
  @MaxLength(50)
  regionalCode!: string;

  @IsNotEmpty()
  @MaxLength(20)
  aslCode!: string;

  @IsNotEmpty()
  @MaxLength(20)
  vatNo!: string;

  @IsNotEmpty()
  @MaxLength(50)
  sdiCode!: string;

  @IsNotEmpty()
  @MaxLength(50)
  pecCode!: string;
}

export class ChildSchemaDTO {
  @IsNotEmpty()
  @MaxLength(80)
  firstName!: string;

  @IsNotEmpty()
  @MaxLength(80)
  lastName!: string;

  @IsEnum(GenderEnum)
  gender!: GenderEnum;

  @IsNotEmpty()
  @IsDDMMYYYY()
  dob!: string;

  @IsNotEmpty()
  @Length(16, 16)
  taxCode!: string;

  @IsNotEmpty()
  placeOfBirthCityId!: number;

  @IsArray()
  pediatricianIds!: number[];
}

export class RegisterParentDTO {
  @Type(() => RegisterUserDTO)
  @ValidateNested()
  @IsNotEmptyObject()
  parent!: RegisterUserDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildSchemaDTO)
  child!: ChildSchemaDTO[];
}
