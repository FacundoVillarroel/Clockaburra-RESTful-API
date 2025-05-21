import { EmployerUserInput } from "./EmployerUserInput";
import { SystemGeneratedFields } from "./SystemGeneratedFields";

export interface User extends EmployerUserInput, SystemGeneratedFields {
  password: string;
  address: string;
  phoneNumber: string;
}