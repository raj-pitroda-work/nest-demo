import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { IGenericResponse } from "src/types/commonType";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception?.toString() || "Internal Server Error";

    response.status(status).json({
      statusCode: status,
      isSuccess: false,
      message:
        typeof message === "string"
          ? message
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ((message as any).message?.toString() as string),
      error: `An Error for :${process.env.PORT}` + request.path,
    } as IGenericResponse);
  }
}
