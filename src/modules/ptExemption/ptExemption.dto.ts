import { IsNotEmpty, IsNumber, MaxLength, Min } from "class-validator";
import { IsDDMMYYYY } from "src/decorators/pipes/dateFormatValidator";

export class CreatePtExemptionDto {
  @IsNotEmpty()
  exemptionCode: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  exemptionId: number;

  @IsNotEmpty()
  @MaxLength(255)
  note: string;

  @IsNotEmpty()
  @IsDDMMYYYY()
  startDate: Date;

  @IsNotEmpty()
  @IsDDMMYYYY()
  endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  patientId: number;
}
