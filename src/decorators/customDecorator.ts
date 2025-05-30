import {
  applyDecorators,
  Controller,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export const IS_PUBLIC_KEY = "isPublic";
export const ROLE_DECORATOR_KEY = "roles";

export const ApiController = (name: string = "") => {
  return applyDecorators(Controller(name), ApiBearerAuth());
};
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Role = (role: string | string[]) =>
  SetMetadata(ROLE_DECORATOR_KEY, typeof role === "string" ? [role] : role);

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
