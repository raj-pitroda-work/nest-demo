export enum RoleEnum {
  User = "user",
  Admin = "admin",
  SuperAdmin = "superAdmin",
}

export const USER_ROLE_IDS = {
  pediatrician: 1,
  parent: 2,
};

export enum GenderEnum {
  Male = "male",
  Female = "female",
}

export enum TOKEN_VAR_ENUM {
  AUTH = "authorization",
  Token = "token",
}

export const PRESCRIPTION_STATUS_ID = {
  PR01: 1, //Request sent to pediatrician
  PR02: 2, // rejected
  PR03: 3, // under review by pediatrician
  PR04: 4, // completed prescription generated
  PR09: 5, // cancelled by parent
};

export const PRESCRIPTION_STATUS_ENUM = {
  PR01: "PR01", //Request sent to pediatrician
  PR02: "PR02", // rejected
  PR03: "PR03", // under review by pediatrician
  PR04: "PR04", // completed prescription generated
  PR09: "PR09", // cancelled by parent
};

export const MAX_MED_COUNT_ALLOWED = 2;
export const MAX_LAB_SER_COUNT_ALLOWED = 2;

export const BE_DATE_FORMAT = "DD/MM/YYYY";
