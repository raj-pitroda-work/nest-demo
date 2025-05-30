import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { throwCustomError } from "src/exceptions/customException";

const mapValidationErrors = (
  err: ValidationError,
  parentKey: string = "",
): string => {
  let errorMessage = "";
  if (parentKey) {
    errorMessage = Object.values(err.constraints || {})
      .map((x) => parentKey + (Number(parentKey) >= 0 ? "]." : ".") + x)
      .join(", ");
  } else errorMessage = Object.values(err.constraints || {}).join(", ");
  if (err?.children && err.children.length > 0) {
    let childMessages: string[] | string = err.children.map((childErr) =>
      mapValidationErrors(childErr, err.property),
    );

    if (parentKey)
      childMessages = childMessages.map((x) => parentKey + "[" + x).join("; ");
    else childMessages = childMessages.join("; ");
    errorMessage = `${errorMessage ? errorMessage + "; " : ""}${childMessages}`;
  }

  return errorMessage;
};

export async function validateDto<T>(
  cls: new () => T,
  data: unknown,
): Promise<T> {
  const dto = plainToInstance(cls, data);
  const errors = await validate(dto as any);
  if (errors?.length > 0) {
    const message = errors.map((err) => mapValidationErrors(err)).join("; ");
    throwCustomError(message, 400);
  }

  return dto;
}

export function validateRequest<T>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateDto(dtoClass, req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
