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
