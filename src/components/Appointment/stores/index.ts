import { atom } from "recoil";
import { FormValue, Service } from "@/components/Appointment/type";

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
