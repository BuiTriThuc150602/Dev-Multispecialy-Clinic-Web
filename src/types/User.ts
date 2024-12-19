export interface User extends Patient {
  email?: string;
  username?: string;
}

export interface Patient {
  id?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
  address?: Address;
  phone?: string;
  gender?: boolean;
  dob?: string;
  priority?: number;
  patientId?: string;
  account?: any;
  age?: number;
  email?: string;
}
export interface Address {
  city?: string;
  state?: string;
  address?: string;
}
