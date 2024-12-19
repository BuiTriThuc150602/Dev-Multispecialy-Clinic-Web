import { atom } from "recoil";

export const isScreenPatientInfoValue = atom<boolean>({
  key: "isScreenPatientInfo",
  default: true,
});
