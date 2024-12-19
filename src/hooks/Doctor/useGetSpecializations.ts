import { DoctorService } from "@/services/Doctor/DoctorService";
import { Doctor } from "@/types/Doctor";
import { useEffect, useState } from "react";

export const useGetSpecializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { getSpecializations, getDoctors } = DoctorService();

  const fetchSpecializations = async () => {
    const response = await getSpecializations();
    if (response?.status) {
      const data = response.data.map((specialization: any) => {
        return {
          ...specialization,
          label: specialization.name,
          value: specialization.specialization_id,
        };
      });
      setSpecializations(data);
    }
  };

  const fetchDoctors = async () => {
    const response = await getDoctors();
    if (response?.status) {
      const data = response.data.map((doctor: any) => {
        return {
          ...doctor,
          label: doctor.fullName,
          value: doctor.fullName,
        };
      });
      setDoctors(data);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  return {
    specializations,
    doctors,
    setSpecializations,
    fetchSpecializations,
    fetchDoctors,
  };
};
