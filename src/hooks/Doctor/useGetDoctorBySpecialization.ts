import { DoctorService } from "@/services/Doctor/DoctorService";
import { useState } from "react";

export const useGetDoctorBySpecialization = () => {
  const [doctor, setDoctor] = useState([]);
  const { getDoctorBySpecialization } = DoctorService();

  const fetchDoctorBySpecialization = async (specialization: string) => {
    const response = await getDoctorBySpecialization(specialization);
    if (response?.status) {
      const data = response.data.map((doctor: any) => {
        return {
          ...doctor,
          label: doctor.fullName,
          value: doctor.fullName,
        };
      });
      setDoctor(data);
    }
  };

  return { doctor, setDoctor, fetchDoctorBySpecialization };
};
