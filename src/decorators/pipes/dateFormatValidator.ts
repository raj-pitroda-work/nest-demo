import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import * as moment from "moment";

export const IsDDMMYYYY = (validationOptions?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsDDMMYYYYWithMoment",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== "string") return false;

          // Check if the date is in valid DD-MM-YYYY format using moment
          const isValidDate = moment(value, "DD/MM/YYYY", true).isValid();
          return isValidDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format DD/MM/YYYY`;
        },
      },
    });
  };
};
