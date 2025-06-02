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

export type IPediaElWhitePdfData = {
  doctor: {
    name: string;
    piva: string;
    address: string;
    phone: string;
    email: string;
  };
  patient: {
    name: string;
    cf: string;
  };
  prescription: {
    repeatable: boolean;
    medicines?: {
      name: string;
      quantity: number;
      packageSize: string;
      posologia: string;
    }[];
    services?: { name: string; branch: string }[];
    labTests?: { name: string; branch: string }[];
    notes: string;
  };
};
