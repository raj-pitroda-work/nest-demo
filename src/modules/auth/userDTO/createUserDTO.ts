import { IsNotEmpty, MaxLength } from "class-validator";
import { LoginDTO } from "../authDto";

export class CreateUserDTO extends LoginDTO {
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
