export interface Address {
  city: string;
  state: string;
  address: string;
}

export interface LabDetail {
  name: string;
  description?: string;
  notes?: string;
  recommendations?: string;
  status?: string;
  range?: string;
  unit?: string;
  value?: number;
}

export interface LabTest {
  id: number;
  labTest: {
    name: string;
    price: number;
  };
  requestDate: string;
  status: string;
  testResult: {
    result: string;
    detail: LabDetail[];
    notes: string;
    images: string[];
  };
}

export interface Doctor {
  employeeId: string;
  phone: string;
  fullName: string;
  address: string | null;
  gender: boolean;
  dob: string;
}

export interface Medication {
  id: number;
  description: string;
  dosage: string;
  image: string;
  name: string;
  unitPrice: number;
  unitStock: string;
  usage: string;
}

export interface Medications {
  id: number;
  medication: Medication[];
  note: string;
  quantity: number;
}
export interface Prescription {
  id: number;
  medications: Medications[];
  note: string;
}
export interface Entry {
  id: number;
  symptoms: string;
  doctor: Doctor;
  visitDate: string;
  diagnosis: string | null;
  treatmentPlan: string;
  medicalInformation: string | null;
  note: string;
  labRequests: LabTest[];
  prescriptions: Prescription[];
}

export interface Patient {
  fullName: string;
  age: number;
  priority: number;
  patientId: string;
  phone: string;
  address: Address;
  dob: string;
  gender: boolean;
}

export interface PatientRecordProps {
  id: number;
  patient: Patient;
  notes: string;
  entries: Entry[];
}

export interface IRowDetail {
  name: string;
  value: string | number;
}
