import { Patient } from "@/types/User";

export enum Service {
  InHour = "InHour",
  OutHour = "OutHour",
}
export enum Gender {
  false = "Nam",
  true = "Nữ",
}
export type FormValue = {
  service?: Service;
  date?: string;
  time?: string;
  symptoms?: string;
  patient?: Patient;
  doctor?: {
    name?: string;
    specialization?: string;
  };
};
