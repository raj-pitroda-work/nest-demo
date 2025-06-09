import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
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

export class CreateElPrescriptionMedDTO extends CreateElWhitePrescriptionMedDTO {
  @IsNumber()
  @IsOptional()
  exemptionId: number;

  @IsNotEmpty()
  isSuggestedPrescription: boolean;

  @IsNotEmpty()
  isNotReplaceable: boolean;

  @IsString()
  @IsOptional()
  irReplaceableReason?: string;
}

export class CreateElPrescriptionServiceDTO extends CreateElWhitePrescriptionServiceDTO {
  @IsNumber()
  @IsOptional()
  exemptionId: number;

  @IsNotEmpty()
  servicePriorityId: number;

  @IsNotEmpty()
  tipAccessId: number;

  @IsNotEmpty()
  isSuggestedPrescription: boolean;
}

export class CreateElPrescriptionLabDTO extends CreateElPrescriptionServiceDTO {}

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

export class CreateElPrescriptionDTO {
  @IsNumber()
  @IsNotEmpty()
  prescriptionId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  note!: string;

  @IsNotEmpty()
  diagnosisId: number;

  @IsNotEmpty()
  visitTypeId: number;

  @IsBoolean()
  @IsNotEmpty()
  isDarkPatientData: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElPrescriptionMedDTO)
  @IsOptional()
  medicine?: CreateElPrescriptionMedDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElPrescriptionServiceDTO)
  @IsOptional()
  service?: CreateElPrescriptionServiceDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateElPrescriptionLabDTO)
  @IsOptional()
  laboratory?: CreateElPrescriptionLabDTO[];

  @Validate(AtLeastOnePrescriptionConstraint)
  prescriptionGroupCheck: any;
}
