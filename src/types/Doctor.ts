export interface Specialization {
  specialization_id: string;
  name: string;
}

export interface Doctor {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  address: object;
  phone: string;
  gender: boolean;
  dob: string;
  employeeId: string;
  specialization: Specialization;
  label: string;
  value: string;
}
