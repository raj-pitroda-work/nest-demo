import { IsNotEmpty, MaxLength } from "class-validator";

export class RejectPrescriptionDTO {
  @IsNotEmpty()
  @MaxLength(100)
  reason!: string;

  @IsNotEmpty()
  prescriptionId!: number;
}
