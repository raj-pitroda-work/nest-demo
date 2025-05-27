import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, map } from "rxjs";
import { IApiResponse, IGenericResponse } from "src/types/commonType";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IGenericResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IGenericResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: IApiResponse<T>) => {
        const { data: methodData, message, statusCode } = data;
        return {
          statusCode: statusCode || response.statusCode || HttpStatus.OK,
          isSuccess: true,
          message: message,
          data: methodData,
        };
      }),
    );
  }
}
