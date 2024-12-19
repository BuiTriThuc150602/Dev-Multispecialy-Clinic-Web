import { axiosInstance } from "@/api/axiosInstance";
import { useApiRequest } from "@/hooks/useApiRequest";
import { userValue } from "@/stores/user";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";

export const PatientService = () => {
  const setUser = useSetRecoilState(userValue);
  const getByPhone = async (phone: string) => {
    return useApiRequest({
      apiCall: axiosInstance.get(`patient/findByPhone/${phone}`),
      catchError: true,
    });
  };

  const getById = async (id: string) => {
    const response = await useApiRequest({
      apiCall: axiosInstance.get(`patient/${id}`),
      catchError: true,
    });
    if (response) return response;
  };

  const getMedicalRecord = async (patientId: string) => {
    return useApiRequest({
      apiCall: axiosInstance.get(`medical-record?patientId=${patientId}`),
      catchError: true,
    });
  };

  const updateInfo = async (patient_id: string, data: any) => {
    const response = await useApiRequest({
      apiCall: axiosInstance.put(`patient/${patient_id}`, data),
      catchError: true,
    });
    if (response?.data.statusCode === 200) {
      toast.success("Cập nhật thông tin thành công");
      setUser(response?.data.data);
      return response;
    }
    return null;
  };

  return { getByPhone, getById, getMedicalRecord, updateInfo };
};
