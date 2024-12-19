import { axiosInstance } from "@/api/axiosInstance";
import { useApiRequest } from "@/hooks/useApiRequest";

export const DoctorService = () => {
  const getSpecializations = async () => {
    return await useApiRequest({
      apiCall: axiosInstance.get("doctor/specializations"),
    });
  };
  const getDoctors = async () => {
    return await useApiRequest({
      apiCall: axiosInstance.get("doctor"),
    });
  };
  const getDoctorBySpecialization = async (specializationId: string) => {
    return await useApiRequest({
      apiCall: axiosInstance.get(`doctor/specialization/${specializationId}`),
    });
  };
  return { getSpecializations, getDoctors, getDoctorBySpecialization };
};
