import { Patient } from "./User";

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
  time?: string | null;
  symptoms?: string;
  patient?: Patient;
  doctor?: {
    name?: string | null;
    specialization?: string;
  };
};

export interface Appointment {
  id: number;
  date: string;
  time: string;
  isWalkIn: boolean;
  status: string;
  symptoms: string;
  doctor: Doctor;
  service: ServiceAppointment;
  patient: Patient;
  isCancel: boolean;
  index?: number;
}

export interface Doctor {
  id: number;
  fullName: string;
  employeeId: string;
  specialization: Specialization;
}

export interface Specialization {
  specialization_id: string;
  name: string;
}

export interface ServiceAppointment {
  id: number;
  name: string;
  price: number;
}

export enum StatusAppointment {
  all = "Tất cả",
  caceled = "Đã hủy",
  arrived = "Đã đến khám",
  appointment = "Đã đặt lịch",
}
