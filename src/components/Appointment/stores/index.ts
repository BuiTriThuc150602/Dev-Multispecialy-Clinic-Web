import { FormValue, Service } from "@/types/Appointment";
import { atom } from "recoil";

export const stepState = atom({
  key: "stepState",
  default: 1,
});

export const formValuesState = atom<FormValue | null>({
  key: "formValuesState",
  default: {
    service: Service.InHour,
  },
});
