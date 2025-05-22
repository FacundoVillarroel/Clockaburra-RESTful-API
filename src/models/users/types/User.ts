import { EmployerUserInput } from "./EmployerUserInput";
import { SystemGeneratedFields } from "./SystemGeneratedFields";

export default interface User extends EmployerUserInput, SystemGeneratedFields {
  password?: string;
  address?: string;
  phoneNumber?: string;
  resetPasswordToken?: string | null;
}