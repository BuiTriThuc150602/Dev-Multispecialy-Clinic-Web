import { IFormForgotPassword, IFormValue } from "@/types/Authentication";
import { atom } from "recoil";

export const formValue = atom<IFormValue>({
  key: "formValue",
  default: {},
});

export const formForgotPassword = atom<IFormForgotPassword>({
  key: "formForgotPassword",
  default: {},
});

export const isScreenAuthenValue = atom<string>({
  key: "isScreenAuthenValue",
  default: "signIn",
});
