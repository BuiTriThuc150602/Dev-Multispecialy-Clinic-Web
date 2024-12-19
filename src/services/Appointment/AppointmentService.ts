import { axiosInstance } from "@/api/axiosInstance";
import { useApiRequest } from "@/hooks/useApiRequest";
import { FormValue } from "@/types/Appointment";
import { useState } from "react";
import toast from "react-hot-toast";

export const AppointmentService = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const loadingType = {
    Appointment: "Appointment",
    getAppointments: "getAppointments",
    cancelAppointment: "cancelAppointment",
  };
  const appointment = async (formValues: FormValue) => {
    const response = await useApiRequest({
      apiCall: axiosInstance.post("appointment", formValues),
      loadingType: loadingType.Appointment,
      setIsLoading,
    });

    if (response) {
      toast.success("Đặt lịch thành công");
      return true;
    }
    return false;
  };

  const getAppointments = async () => {
    return await useApiRequest({
      apiCall: axiosInstance.get("appointment/me"),
      loadingType: loadingType.getAppointments,
      setIsLoading,
    });
  };

  const cancelAppointment = async (id: number) => {
    return await useApiRequest({
      apiCall: axiosInstance.delete(`appointment/cancel/${id}`),
      loadingType: loadingType.cancelAppointment,
      setIsLoading,
    });
  };

  return {
    isLoading,
    loadingType,
    appointment,
    getAppointments,
    cancelAppointment,
  };
};
