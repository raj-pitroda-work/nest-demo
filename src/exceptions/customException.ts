import { HttpException, HttpStatus } from "@nestjs/common";

class CustomException extends HttpException {
  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(
      {
        statusCode,
        error: "CustomError",
        message,
      },
      statusCode,
    );
  }
}

export function throwCustomError(message: string, status?: number): never {
  throw new CustomException(message, status);
}
