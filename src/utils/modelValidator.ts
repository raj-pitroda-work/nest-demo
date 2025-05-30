import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { throwCustomError } from "src/exceptions/customException";

export const validateDto = async (cls: any, data: object) => {
  const dto = plainToInstance(cls, data);
  const errors = await validate(dto as any);

  if (errors.length > 0) {
    const messages = errors
      .map((err) => Object.values(err.constraints || {}).join(", "))
      .join(", ");
    throwCustomError(messages);
  }

  return dto;
};
