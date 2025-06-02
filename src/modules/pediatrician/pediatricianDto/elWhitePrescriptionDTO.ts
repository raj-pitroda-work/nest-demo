import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { msg } from "src/utils/msg";

export class CreateElWhitePrescriptionMedDTO {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  packageSize!: string;

  @IsNotEmpty()
  posologyId!: number;

  @IsNotEmpty()
  posologyLabel!: string;

  @IsNotEmpty()
  medicineTypeId!: number;

  @IsNotEmpty()
  quantity!: number;
}

export class CreateElWhitePrescriptionServiceDTO {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  noOfSessions!: number;

  @IsString()
  @IsNotEmpty()
  explanatoryNote!: string;

  @IsNotEmpty()
  branchId!: number;

  @IsNotEmpty()
  branchName!: string;
}

export class CreateElWhitePrescriptionLabDTO extends CreateElWhitePrescriptionServiceDTO {}

@ValidatorConstraint({ name: "atLeastOnePrescription", async: false })
class AtLeastOnePrescriptionConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return (
      (obj.medicine && obj.medicine.length > 0) ||
      (obj.service && obj.service.length > 0) ||
      (obj.laboratory && obj.laboratory.length > 0)
    );
  }

  defaultMessage(_args: ValidationArguments) {
    return msg.atLeast1MedSerOrLab;
  }
}

export class CreateElWhitePrescriptionDTO {
  @IsNumber()
  @IsNotEmpty()
  prescriptionId!: number;

  @IsString()
  @IsNotEmpty()
  note!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElWhitePrescriptionMedDTO)
  @IsOptional()
  medicine?: CreateElWhitePrescriptionMedDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElWhitePrescriptionServiceDTO)
  @IsOptional()
  service?: CreateElWhitePrescriptionServiceDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElWhitePrescriptionLabDTO)
  @IsOptional()
  laboratory?: CreateElWhitePrescriptionLabDTO[];

  @Validate(AtLeastOnePrescriptionConstraint)
  prescriptionGroupCheck: any;
}
