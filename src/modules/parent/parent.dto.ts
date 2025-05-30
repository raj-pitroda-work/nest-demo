import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateParentPrescriptionRequestDTO {
  @IsNotEmpty()
  @MaxLength(250)
  requestDescription!: string;

  @IsNotEmpty()
  @MaxLength(250)
  motivationNotes!: string;

  @IsNotEmpty()
  patientId!: number;

  @IsNotEmpty()
  pediatricianId!: number;
}
