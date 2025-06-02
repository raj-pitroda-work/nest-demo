export type IGenericResponse<T = null> = {
  statusCode: number;
  isSuccess: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type IApiResponse<T = null> = Partial<IGenericResponse<T>>;
export type IPromiseApiResponse<T = null> = Promise<
  Partial<IGenericResponse<T>>
>;

export type IOption = {
  label: string;
  value: number | string;
};

export type ITokenUser = {
  createdAt: string;
  dob: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  otp: string;
  otpCreatedAt: string;
  placeOfBirthCityId: number;
  roleId: number;
  taxCode: string;
  userIdentityImageId: number;
};
