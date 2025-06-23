import { PRESCRIPTION_STATUS_ID } from "src/utils/constant";

export type IParentPrescriptions = {
  [monthName: string]: [
    {
      id: number;
      rejectReason: null | string;
      requestDescription: string;
      status: keyof typeof PRESCRIPTION_STATUS_ID;
      statusId: number;
      updatedAt: string;
      medicineCount: number;
      laboratoryCount: number;
      serviceCount: number;
      motivationNotes: string;
      createdAt: string;
      prescribedPrescriptionFileName: string | null;
      patientFileNames: string | null;
      prescribedPrescriptionBarcode: string | null;
    },
  ];
};
