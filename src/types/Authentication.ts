import { Patient } from "./User";

export interface IFormValue {
  patient?: Patient;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IFormForgotPassword extends ForgotPassword {
  phone?: string;
}

export interface ForgotPassword {
  username?: string;
  password?: string;
}

export interface IAuthFormProps {
  setIsScreen: (value: string) => void;
}
