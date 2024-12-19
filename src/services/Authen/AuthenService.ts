import { useApiRequest } from "@/hooks/useApiRequest";
import { axiosInstance } from "@/api/axiosInstance";
import { useState } from "react";
import { ForgotPassword } from "@/types/Authentication";

export const AuthenService = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  enum typeLoading {
    signUp = "signUp",
    signIn = "signIn",
  }

  const signUp = async (data: any) => {
    return await useApiRequest({
      apiCall: axiosInstance.post("/auth/register-patient", data),
      catchError: true,
      loadingType: typeLoading.signUp,
      setIsLoading: setIsLoading,
    });
  };

  const signIn = async (data: any) => {
    return await useApiRequest({
      apiCall: axiosInstance.post("/auth/login", data),
      catchError: true,
      loadingType: typeLoading.signIn,
      setIsLoading: setIsLoading,
    });
  };

  const checkExistUsername = async (username: string) => {
    return await useApiRequest({
      apiCall: axiosInstance.get(`/auth/check-username/${username}`),
      catchError: true,
    });
  };

  const checkPatiendId = async (patientId: string) => {
    return await useApiRequest({
      apiCall: axiosInstance.get(`/auth/check-patientId/${patientId}`),
      catchError: true,
    });
  };

  const getProfile = async () => {
    return await useApiRequest({
      apiCall: axiosInstance.get("/auth/profile"),
      catchError: true,
    });
  };

  const forgotPassword = async (data: ForgotPassword) => {
    return await useApiRequest({
      apiCall: axiosInstance.post("/auth/forgot-password-patient", data),
      catchError: true,
    });
  };

  return {
    isLoading,
    typeLoading,
    signUp,
    signIn,
    checkExistUsername,
    checkPatiendId,
    getProfile,
    forgotPassword,
  };
};
