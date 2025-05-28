import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const ROLE_DECORATOR_KEY = "roles";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Role = (role: string | string[]) =>
  SetMetadata(ROLE_DECORATOR_KEY, typeof role === "string" ? [role] : role);
